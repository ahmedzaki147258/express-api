const express = require('express');
const router = express.Router();
const {User, userValidate} = require('../model/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
    const {error, value} = validate(req.body); 
    if(error){
        return res.status(404).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(404).send('Invalid email or password');
    }
    console.log(user);
    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if(!checkPassword){
        return res.status(404).send('Invalid email or password');
    }
    const token = user.generateTokens();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(525).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;