
// npm install multer axios cors form-data dotenv
if(process.env.NODE_ENV != "production"){
  require("dotenv").config(); 
}
  
const express = require("express");
const app = express();

const mongoose = require("mongoose");
async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}
main().then(()=>{
    console.log("successfully connected to database 'justScan'");
})
.catch((err)=>{
    console.log(err);
});
const Student = require("./models/student.js");
const Temp = require("./models/temp.js");

const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
// const cors = require('cors');           // from here till 3
// const upload = require('./multerConfig');
// const { processImage } = require('./ocrService');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// const { isOwner } = require("./middleware.js");

//  requiring 'wrapAsync' fn. and making expressError class(made by us)
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

const { ensureAuthenticated, saveRedirectUrl, isOwner} = require('./middleware.js');

//-> requiring routes
const processRouter = require("./routes/process.js");
const editRouter = require("./routes/edit.js");
const listRouter = require("./routes/list.js");

// -> using session store
const MongoStore = require("connect-mongo");

//................................................................................................

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// app.use(cors());             // ->from here till 2
app.use(express.json()); 

const store= MongoStore.create({                // (creating session store) write it at above session options
  mongoUrl: process.env.ATLASDB_URL,
  crypto:{
      secret: process.env.SECRET,
  },
  touchAfter: 24*3600, 
});
store.on("error",()=>{
  console.log("ERROR in mongo SESSION STORE");
}); 

sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  // Here, you can store user info in DB
  return done(null, profile);
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(flash());
//-> middleware to save 'flash-msg' in 'res.locals' to be used in templates
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.entryMsg = req.flash("entry");
        // console.log(req.user);
    res.locals.currUser = req.user ? req.user._json.email : null;
    next();
});


// 80646328450-o10m6ac6pjmd2s3c64fri26el1hi1960.apps.googleusercontent.com
//...................................................
let port =process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`app is listening on port${port}`);
}); 

// Health check route for Render
app.get("/ping", (req, res) => res.send("pong"));

app.get("/",(req,res)=>{
    // console.log("home route");

    res.render("index.ejs");
});

app.use("/", processRouter);

app.use("/edit/:roll_no", editRouter);

app.use("/", listRouter);


app.get("/login",wrapAsync(async(req,res)=>{
  await Temp.deleteMany({});
  res.render("login.ejs");
}));

app.get("/auth/google",
  passport.authenticate("google",{scope: ["profile", "email"]})
);

app.get("/auth/google/callback", saveRedirectUrl, passport.authenticate("google", { failureRedirect: "/login" }), 
  (req, res) => {
      req.flash("success", "welcome back to justScan");
      
      let redirectUrl = res.locals.redirectUrl;
      res.redirect(redirectUrl); // Successful login
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
      res.redirect("/");
  });
});

app.get("/addStudent",ensureAuthenticated, isOwner,(req,res)=>{
  res.render("new.ejs");
});

app.post("/addStudent",ensureAuthenticated, isOwner, wrapAsync(async (req, res, next) => {
  try {
    let student = req.body.student;
    console.log(student);

    // Generate the email field from the roll_no
    student = { ...student, email: `${student.roll_no}@iiitu.ac.in` };
    console.log(student);
    // Create a new student document using Mongoose's create method
    await Student.create(student);
    
    res.redirect("/list");
  } catch (err) {
    next(err);
  }
}));



//......................
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.all("*", (req,res,next)=>{
  next(new expressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something went wrong!"} = err;
  // say.speak(message, 'Samantha', 1.0, (error) => {
  //   if (error) {
  //       console.error("TTS Error:", error);
  //   }
  // });

  req.flash("error", `${message}`);
  console.log("error",message);
  let redirectUrl = req.originalUrl || "/";
  res.status(statusCode).redirect(redirectUrl);

});    

