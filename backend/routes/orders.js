const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orders')
const { protect } = require('../middleware/auth') 

router.post('/', protect, orderController.createOrder)

module.exports = router
