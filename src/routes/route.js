const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send("Welcome to philiphs thomas")
})

const AuthRoutes = require('./authRoutes/authRoute')
const ProductRoutes = require('./productRouter/productRouter')
const CategoryRoutes = require('./categoryRoutes/categoryRoute')

router.use(
    "/api",
    AuthRoutes,
    ProductRoutes,
    CategoryRoutes
)

module.exports = router;