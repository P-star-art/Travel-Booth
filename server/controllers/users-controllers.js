const { v4: uuid } = require('uuid');

const HttpError = require('../models/http-error');


const USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'max@gmail.com',
        password: '123456',
    },
    {
        id: 'u2',
        name: 'Manu Biatch',
        email: 'manu@gmail.com',
        password: '123456'
    }
];

const getUsers = (req, res, next) => {

    if (USERS.length === 0) {
        throw new HttpError('Could not find any users', 404);
    }

    res.status(200).json({ users:USERS });
}

const signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const hasUser = USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('user cannot be created, email already exists', 422);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    }

    USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
}

const login = (req, res, next) => {

    const { email, password } = req.body;

    const identifiedUser = USERS.find(u => u.email === email);

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('user not found, or invalid credentials', 401);
    }

    res.json({ message: "logged in!" });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;