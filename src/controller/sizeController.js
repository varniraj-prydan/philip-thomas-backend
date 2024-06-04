const Size = require('../models/sizeModel'); // Adjust the path as needed
const { correctResponse, statusCode, messageResponse } = require('../utils/response');

// Create a new size
exports.createSize = async (req, res) => {
    try {
        const newSize = new Size(req.body);
        await newSize.save();
        return correctResponse({
            res,
            statusCode: statusCode.CREATED,
            msg: messageResponse.ADDED,
            data: newSize
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.BAD_REQUEST,
            msg: messageResponse.BAD_REQUEST,
            data: error.message
        });
    }
};

// Get all sizes
exports.getSizes = async (req, res) => {
    try {
        const sizes = await Size.find();
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: sizes
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error.message
        });
    }
};

// Get a single size by ID
exports.getSizeById = async (req, res) => {
    try {
        const size = await Size.findById(req.params.id);
        if (!size) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND
            });
        }
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: size
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error.message
        });
    }
};

// Update a size
exports.updateSize = async (req, res) => {
    try {
        const size = await Size.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!size) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND
            });
        }
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.UPDATED,
            data: size
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.BAD_REQUEST,
            msg: messageResponse.BAD_REQUEST,
            data: error.message
        });
    }
};

// Delete a size
exports.deleteSize = async (req, res) => {
    try {
        const size = await Size.findByIdAndDelete(req.params.id);
        if (!size) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND
            });
        }
        return correctResponse({
            res,
            statusCode: statusCode.NO_CONTENT,
            msg: messageResponse.DELETED
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error.message
        });
    }
};