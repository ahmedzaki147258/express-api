const mongoose = require('mongoose');
const Joi = require('joi');

const Employee = mongoose.model('Employee', new mongoose.Schema({
    fullname: {type: String, required: true, minlength: 3, maxlength: 30},
    salary: {type: Number, required: true}
}));



function employeeValidate(employee) {
    const schema = Joi.object({
        fullname: Joi.string().min(5).required(),
        salary: Joi.number().integer().required()
    });
    return schema.validate(employee);
}

function employeePutValidate(employee) {
    const schema = Joi.object({
        fullname: Joi.string().min(5).required(),
        salary: Joi.number().integer().required()
    });
    return schema.validate(employee);
}

exports.Employee = Employee;
exports.employeeValidate = employeeValidate;
exports.employeePutValidate = employeePutValidate;