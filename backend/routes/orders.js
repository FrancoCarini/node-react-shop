const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orders')
const { protect } = require('../middleware/auth') 

router.post('/', protect, orderController.createOrder)
router.get('/myorders', protect, orderController.getMyOrders)
router.get('/:id', protect, orderController.getOrderById)
router.put('/:id/pay', protect, orderController.updateOrderToPaid)

module.exports = router
