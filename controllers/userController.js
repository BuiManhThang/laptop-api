const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');
const path = require('path');
const fs = require('fs');

exports.user_register = [
    body('name').trim().isLength({max: 80, min: 1}).withMessage('This field is required').escape(),
    body('email').trim().isLength({max: 200, min: 1}).withMessage('This field is required').isEmail().withMessage('Email is invalid').escape(),
    body('password').trim().isLength({max: 32, min: 6}).withMessage('Password must have at least 6 characters and include a number').escape(),
    body('confirmPassword').trim().isLength({max: 32, min: 6}).withMessage('Password must have at least 6 characters and include a number').escape(),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.json({errors: errors.array()})
            }
            const foundUser = await User.findOne({email: req.body.email});
            if(foundUser) {
                return res.json({errors: [{param: 'email', msg: 'Email has already been existed'}]});
            }
            if(req.body.password !== req.body.confirmPassword) {
                return res.json({errors: [{param: 'comfirmPassword', msg: 'Your password is not match'}]});
            }
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.password, salt);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            });
            const newUser = await user.save();

            const token = jwt.sign({_id: newUser._id}, process.env.SECRET_KEY);
            res.cookie('jwt', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });

            const {password, ...info} = newUser.toJSON();
            res.json(info);

        } catch(err) {
            res.status(501).json(err);
        }
    }
]

exports.user_info = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if(!user) {
            return res.status(401);
        }
        const {password, ...info} = user.toJSON();
        res.json(info);
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.user_signin = [
    body('email').trim().isLength({max: 200, min: 1}).withMessage('This field is required').isEmail().withMessage('Email is invalid').escape(),
    body('password').trim().isLength({max: 32, min: 6}).withMessage('Password must have at least 6 characters and include a number').escape(),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.json({errors: errors.array()})
            }
            const foundUser = await User.findOne({email: req.body.email});
            if(!foundUser) {
                return res.json({errors: [{param: 'password', msg: 'Email or password is not correct'}]});
            }
            
            const isSuccess = await bcrypt.compare(req.body.password, foundUser.password);

            if(!isSuccess) {
                return res.json({errors: [{param: 'password', msg: 'Email or password is not correct'}]});
            }

            const token = jwt.sign({_id: foundUser._id}, process.env.SECRET_KEY);
            res.cookie('jwt', token, {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });

            const {password, ...info} = foundUser.toJSON();
            res.json(info);

        } catch(err) {
            res.status(501).json(err);
        }
    }
]

exports.user_logout = async (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 0,
        httpOnly: true
    });
    res.json({name: '', email: '', address: ''});
}

exports.user_update = [
    body('name').trim().isLength({max: 80, min: 1}).withMessage('This field is required').escape(),
    body('phone').trim().escape(),
    body('landmark').trim().escape(),
    body('city').trim().escape(),
    
    async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            let pathNewAvata;
            if(req.file)  {
                pathNewAvata = path.join(__dirname.slice(0, __dirname.indexOf('controllers')), 'public', 'images', 'users', req.file.filename);
            }
            
            if(!user) {
                if(req.file) {
                    await fs.unlinkSync(pathNewAvata);
                }
                return res.status(401).json({message: 'User not found'});
            }
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                if(req.file) {
                    await fs.unlinkSync(pathNewAvata);
                }
                return res.json({errors: errors.array()});
            }
            if(req.body.phone !== '') {
                const phoneRegex = /\d{10}/;
                if(!phoneRegex.test(req.body.phone)) {
                    if(req.file) {
                        await fs.unlinkSync(pathNewAvata);
                    }
                    return res.json({errors: [{param: 'phone', msg: 'Phone number is invalid'}]});
                } 
            }
            
            if(req.body.name !== user.name) {
                user.name = req.body.name;
            }
            if(req.body.phone !== '') {
                user.phone = req.body.phone;
            }
            if(req.body.landmark !== '') {
                user.address.landmark = req.body.landmark;
            }
            if(req.body.city !== '') {
                user.address.city = req.body.city;
            }
            if(req.file) {
                if(user.avata !== 'default-avata.jpg') {
                    const pathAvata = path.join(__dirname.slice(0, __dirname.indexOf('controllers')), 'public', 'images', 'users', user.avata);
                    await fs.unlinkSync(pathAvata);
                }
                user.avata = `${req.file.filename}`;
            }
            await User.updateOne({_id: user._id}, user);
            const {password, ...info} = user.toJSON();
            res.json(info);
        } catch(err) {
            res.status(501).json(err);
        }
    }
]