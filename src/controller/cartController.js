const Cart = require('../models/cart');
const { statusCode, messageResponse, correctResponse } = require('../utils/response');

exports.checkProductInCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
                data: { exists: false }
            });
        }

        const productExists = cart.items.some(item => item.productId.toString() === productId);

        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: { exists: productExists }
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};

exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.params.userId;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (productIndex > -1) {
                cart.items[productIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.ADDED,
            data: cart
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};

// Get the cart details
exports.getCart = async (req, res) => {
    const userId = req.params.userId;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
                data: null
            });
        }

        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: cart
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};

// Update the quantity of an item in the cart
exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.params.userId;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
                data: null
            });
        }

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (productIndex > -1) {
            cart.items[productIndex].quantity = quantity;
            await cart.save();
            return correctResponse({
                res,
                statusCode: statusCode.OK,
                msg: messageResponse.UPDATED,
                data: cart
            });
        } else {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
                data: null
            });
        }
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res) => {
    const { productId } = req.body;
    const userId = req.params.userId;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
                data: null
            });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        await cart.save();
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DELETED,
            data: cart
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};

// Clear the cart
exports.clearCart = async (req, res) => {
    const userId = req.params.userId;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
                data: null
            });
        }

        cart.items = [];
        await cart.save();
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DELETED,
            data: cart
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
            data: error
        });
    }
};