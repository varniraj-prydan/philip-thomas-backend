// utils/jwt.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || "SECRET_KEY_FOR_REGISTER_AND_LOGIN_IN_PHILIPH_THOMAS";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        secretKey,  // Replace with your secret key
        { expiresIn: '1d' }  // Token expiration time
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);  // Replace with your secret key
};

module.exports = {
    generateToken,
    verifyToken
};
