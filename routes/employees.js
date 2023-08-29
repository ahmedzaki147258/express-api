const express = require('express');
require('express-async-errors');

const router = express.Router();
const {Employee, employeeValidate, employeePutValidate} = require('../model/employee');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', async (req, res) => {
    const employees = await Employee.find().sort('name')
    res.send(employees);
});

router.get('/pages', async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const employees = await Employee.find().sort('name').limit(limit * 1).skip((page - 1) * limit).exec();
    res.send(employees);
});

router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        if(!employee)
            res.status(404).send("This employee is not found !");
        else
            res.send(employee);
    } catch (error) {
        res.send("This employee is not found !");
    }
});

router.post('/', auth, async (req, res) => {
    const {error, value} = employeeValidate(req.body); 
    if(error){
        return res.send(error.details[0].message);
    }

    const employee = new Employee({
        fullname: req.body.fullname,
        salary: req.body.salary
    });
    await employee.save();
    res.send(employee);
});

router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const {error, value} = employeePutValidate(req.body); 
        if(error){
            return res.send(error.details[0].message);
        }
        const employee = await Employee.findByIdAndUpdate(req.params.id, {
            fullname: req.body.fullname,
            salary: req.body.salary
        }, {new: true});
        if(!employee){
            return res.status(404).send("Invalid ID");
        }
        res.send(employee);
    } catch (error) {
        res.send("This employee is not found !");
    }

});

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const employee = await Employee.findByIdAndRemove(req.params.id);
        if(!employee){
            return res.status(404).send("This employee is not found !");
        }
        res.send(employee);
    } catch (error) {
        res.send("This employee is not found !");
    }
});

module.exports = router;