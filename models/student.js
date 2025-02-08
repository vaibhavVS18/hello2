const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    roll_no: {
        type: Number,
        required: true,
        validate:{
            validator: (v)=>{
                return v.toString().length === 5;
            },
            message: "Roll number must be exactly 5 digits long",
        }
    },
    name:{
        type: String,
        required: true
    },
    mobile_no:{
        type: Number,
        validate:{
            validator: (v)=>{
                return v.toString().length === 10;
            },
            message: "Mobile number must be exactly 10 digits long",
        },
        default: 1234567890,
        required: true,
    },
    hostel_name:{
        type: String,
        enum: ["Bhutagni","Chitaghni","Jathragni"],
        required: true,
    },
    Room_no:{
        type: Number,
        default: 1,
        required: true,
    },
    email:{
        type: String,
    },

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
