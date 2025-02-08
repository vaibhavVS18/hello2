if(process.env.NODE_ENV != "production"){
    require("dotenv").config(); 
}

const {studentJoiSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js");


module.exports.validateStudent = (req,res,next)=>{
    console.log(req.body);
    let {error} = studentJoiSchema.validate(req.body);

    if(error){
        // throw new expressError(400, error);
                    //OR
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();             // bcoz it is a middleware
    }
}


module.exports.ensureAuthenticated= (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl; //bcoz redirecting to '/login' page then req.-res. cycle will be end ,and res.locals works only for a req.-res.cycle

      req.flash("error", "you must be logged in");
      return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl =(req, res, next)=>{     // use it just before login(here, before 'passport.authenticate()' => see in route "/auth/google/callback")
  if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
  } else {
      res.locals.redirectUrl = '/'; // Default redirect to home if none exists
  }
  // console.log(res.locals.redirectUrl);
  next();
};


module.exports.isOwner = async(req,res,next)=>{             // imp.... ->always, it will be use after logged in
  // to check for authorization, if anyone sends req. to update from hoppscotch.
  console.log(res.locals.currUser);
  if( res.locals.currUser!==process.env.OWNER){
      req.flash("error","you have not access of it");
      // console.log(res.locals.redirectUrl);

      // return res.redirect(res.locals.redirectUrl || "/");
      return res.redirect("/");

  }
  next();
}  

module.exports.isGuard = async(req,res,next)=>{             // imp.... ->always, it will be use after logged in
    // to check for authorization, if anyone sends req. to update from hoppscotch.
    console.log(res.locals.currUser);
    if( res.locals.currUser!==process.env.OWNER && res.locals.currUser!== process.env.GUARD){
        req.flash("error","you have not access of it");
        // console.log(res.locals.redirectUrl);
  
        // return res.redirect(res.locals.redirectUrl || "/");
        return res.redirect("/");
    }
    next();
  }  