const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secretKey = 'SECRET_KEY_FOR_REGISTER_AND_LOGIN_IN_PHILIPH_THOMAS'; 

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, secretKey);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};