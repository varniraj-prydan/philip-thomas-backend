const express = require('express');
const {signup,signout,login} = require('../../controller/authController')

const router = express.Router();

router.post('/signup',signup)
router.post('/signout',signout)
router.post('/login', login)

module.exports = router;