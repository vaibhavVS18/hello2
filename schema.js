const Joi = require('joi');

const studentJoiSchema = Joi.object({
    student: Joi.object({
        // roll_no: Joi.number()
        // .integer()
        // .min(10000) // Ensures a minimum value of 10000 (5 digits)
        // .max(99999) // Ensures a maximum value of 99999 (5 digits)
        // .required()
        // .messages({
        //     'number.base': 'Roll number must be a number',
        //     'number.min': 'Roll number must be exactly 5 digits long',
        //     'number.max': 'Roll number must be exactly 5 digits long',
        //     'any.required': 'Roll number is required'
        // }),

    name: Joi.string()
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'any.required': 'Name is required'
        }),

    mobile_no: Joi.number()
        .integer()
        .min(1000000000) // Ensures a minimum value of 1000000000 (10 digits)
        .max(9999999999) // Ensures a maximum value of 9999999999 (10 digits)
        .required()
        .messages({
            'number.base': 'Mobile number must be a number',
            'number.min': 'Mobile number must be exactly 10 digits long',
            'number.max': 'Mobile number must be exactly 10 digits long',
            'any.required': 'Mobile number is required'
        }),

    hostel_name: Joi.string()
        .valid('Bhutagni', 'Chitaghni', 'Jathragni')
        .required()
        .messages({
            'any.only': 'Hostel name must be one of Bhutagni, Chitaghni, or Jathragni',
            'any.required': 'Hostel name is required'
        }),

    Room_no: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .required()
        .messages({
            'number.base': 'Room number must be a number',
            'number.min': 'Room number must be at least 1',
            'any.required': 'Room number is required'
        }),

    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Email must be a valid email address'
        })
    })
});

module.exports = {studentJoiSchema};
