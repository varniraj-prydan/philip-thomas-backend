const express = require('express');
const upload = require('../../helper/handleMulter');
const { addProduct, editProduct, getProducts, getProductById, deleteProductById } = require('../../controller/productController');
const router = express.Router();

router.post('/product',upload.single('productImg'),addProduct)
router.put('/product/:productId',upload.single('productImg'),editProduct)
router.get('/product',getProducts)
router.get('/product/:productId',getProductById)
router.delete('/removeProduct/:productId',deleteProductById)

module.exports = router;