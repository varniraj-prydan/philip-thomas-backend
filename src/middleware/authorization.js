// middleware/authorization.js
const jwt = require('jsonwebtoken');
const { correctResponse, statusCode, messageResponse } = require('../utils/response');

const secretKey = process.env.SECRET_KEY || "SECRET_KEY_FOR_REGISTER_AND_LOGIN_IN_PHILIPH_THOMAS";


const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            // return res.status(401).json({ message: 'Unauthorized' });
            return correctResponse({
                res,
                statusCode: statusCode.UNAUTHORIZED,
                msg: messageResponse.NOT_AUTHORIZED,
            });
        }

        try {
            const decoded = jwt.verify(token, secretKey);  // Replace with your secret key
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return correctResponse({
                    res,
                    statusCode: statusCode.FORBIDDEN,
                    msg: messageResponse.FORBIDDEN,
                });
            }

            next();
        } catch (err) {
            return correctResponse({
                res,
                statusCode: statusCode.UNAUTHORIZED,
                msg: messageResponse.NOT_AUTHORIZED,
                data:err
            });
        }
    };
};

module.exports = authorize;