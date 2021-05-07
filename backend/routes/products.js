const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/auth')  = require('../middleware/auth')

const productController = require('../controllers/products')

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get('/', productController.getProducts)

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
router.route('/:id')
  .get(productController.getProduct)
  .delete(protect, restrictTo('admin'), productController.deleteProduct)

module.exports = router
