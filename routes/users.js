const express = require('express');
const router = express.Router();
const {User, userValidate} = require('../model/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


router.get('/profile', auth, async (req, res) => {
    const profile = await User.findById(req.user._id).select('-password');
    res.send(profile);
});

router.post('/', async (req, res) => {
    const {error, value} = userValidate(req.body); 
    if(error){
        return res.status(404).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(404).send('User found in Database');
    }

    user = new User(_.pick(req.body, ['fullname', 'email', 'password', 'isAdmin']));
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateTokens();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'fullname', 'email']));
});

module.exports = router;