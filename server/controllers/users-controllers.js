const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {

    let users;

    try {
        users = await User.find({}, '-password')
    } catch (err) {
        return next(new HttpError('fetching users failed!', 500));
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });

}

const signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Please provide valid inputs', 422));
    }

    const { name, email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Signing Up failed', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('user cannot be created, email already exists', 422);
        return next(error);
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password);
    } catch (err) {
        return next(new HttpError('Could not create an user, Please try again', 500));
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed', 500);
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

const login = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Please provide valid inputs', 422));
    }

    const { email, password } = req.body;

    let identifiedUser;

    try {
        identifiedUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Invalid credentials, could not log you in', 500);
        return next(error);
    }

    if (!identifiedUser) {
        return next(new HttpError('Invalid credentials', 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        return next(new HttpError('Invalid Credentials', 500));
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in', 500);
        return next(error);
    }
    
    res.json({ message: "logged in!", user: identifiedUser.toObject({ getters: true }) });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;