const express = require("express");
const router = express.Router();

const { ensureAuthenticated, isOwner, isGuard} = require('../middleware.js');
const wrapAsync = require("../utils/wrapAsync.js");

const Student = require("../models/student.js");
const Entry = require("../models/entry.js");




router.get("/list",ensureAuthenticated, isOwner, wrapAsync(async(req,res)=>{
    let studentList = await Student.find({});
    // console.log(studentList);
    console.log(res.locals.redirectUrl);
    
    res.render("list.ejs",{studentList});
}));

router.get("/entryList",ensureAuthenticated, isGuard, wrapAsync(async(req,res)=>{
    let entries = await Entry.find({}).populate("student");
    // console.log(studentList);
    
    res.render("entryList.ejs",{entries});
}));



module.exports = router;