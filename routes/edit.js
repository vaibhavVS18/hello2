const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");

const Student = require("../models/student.js");

const { validateStudent, ensureAuthenticated, isOwner} = require('../middleware.js');
const say = require("say");


router.route("/")
    .get(ensureAuthenticated,isOwner, wrapAsync(async(req,res)=>{
        let {roll_no} = req.params;
        let student = await Student.findOne({roll_no: roll_no});
    
        // console.log(student); 
    
        res.render("edit.ejs",{student});
    }))
    .put(ensureAuthenticated,isOwner ,validateStudent, wrapAsync(async(req,res)=>{
  
        let {roll_no} = req.params;
        let updatedStudent = req.body.student;
      
        await Student.updateOne({roll_no: roll_no}, {roll_no, ...updatedStudent},  {runValidators: true });
      
        say.speak(`Data updated for ${updatedStudent.name}`, 'Samantha', 1.0);
        req.flash("success",`new data updated as name: ${updatedStudent.name}, mobile_no: ${updatedStudent.mobile_no}, hostel_name: ${updatedStudent.hostel_name}`);
        res.redirect(`/edit/${roll_no}`);
      }));

module.exports = router;