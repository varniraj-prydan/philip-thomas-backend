const express = require('express');
const { signup, login, signout } = require('../controller/authController');
const upload = require('../helper/handleMulter');
const { addProduct, editProduct, getProducts, getProductById, deleteProductById } = require('../controller/productController');

const router = express.Router();

router.get('/', (req,res)=>{
    res.send("Welcome to philiphs thomas")
})
router.post('/api/signup',signup)
router.post('/api/signout',signout)
router.post('/api/login', login)

router.post('/api/product',upload.single('productImg'),addProduct)
router.put('/api/product/:productId',upload.single('productImg'),editProduct)
router.get('/api/getProducts',getProducts)
router.get('/api/getProducts/:productId',getProductById)
router.delete('/api/removeProduct/:productId',deleteProductById)


module.exports = router;