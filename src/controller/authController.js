const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { statusCode, correctResponse, messageResponse } = require('../utils/response');
const { generateToken } = require('../helper/jwt');

const secretKey = 'SECRET_KEY_FOR_REGISTER_AND_LOGIN_IN_PHILIPH_THOMAS'; 

exports.signup = async (req, res) => {
    try {
        const { username, password,email,role} = req.body;
        const user = await User.create({ username, password,email,role});
        // res.status(201).json({ message: 'User created successfully', user });
        return correctResponse({
            res,
            statusCode: statusCode.CREATED,
            msg: messageResponse.ADDED,
            data: user
        });
        
    } catch (error) {
        // res.status(400).json({ message: error.message });
        console.log(error,"hello")
        return correctResponse({
            res,
            statusCode: statusCode.BAD_REQUEST,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = generateToken(user);
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            address_id: user.address_id,
            role: user.role,
            // add other fields as necessary, but exclude the password
        };


        // delete user.password;
        // res.json({ token });
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.LOGIN,
            data: {userData ,token}
        });

    } catch (error) {
        // res.status(400).json({ message: error.message });
        console.log(error)
        return correctResponse({
            res,
            statusCode: statusCode.BAD_REQUEST,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });

    }
};

exports.signout = async (req, res) => {
    res.json({ message: 'Sign out successful' });
};