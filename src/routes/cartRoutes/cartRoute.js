const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cartController');
const authorize = require('../../middleware/authorization');

router.post('/cart/:userId', cartController.addItemToCart);
router.get('/cart/:userId', cartController.getCart);
router.get('/cart/:userId/check/:productId',cartController.checkProductInCart);
router.patch('/cart/:userId',cartController.updateCartItem);
router.delete('/cart/remove/:userId',cartController.removeCartItem);
router.delete('/cart/clear/:userId', cartController.clearCart);

module.exports = router;