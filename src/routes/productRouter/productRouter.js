const express = require('express');
const upload = require('../../middleware/handleMulter');
const { addProduct, editProduct, getProducts, getProductById, deleteProductById } = require('../../controller/productController');
const { checkFeatureLimit, checkTrendingLimit } = require('../../middleware/limitHelper');
const authorize = require('../../middleware/authorization');
const router = express.Router();

router.post('/product',upload.single('productImg'),authorize('admin'),checkFeatureLimit, checkTrendingLimit,addProduct)
router.patch('/product/:productId',upload.single('productImg'),checkFeatureLimit, checkTrendingLimit,editProduct)
router.get('/product',getProducts) 
router.get('/product/:productId',getProductById)
router.delete('/removeProduct/:productId',authorize('admin'),deleteProductById)

module.exports = router;