const express = require('express')
const router = express.Router()
const productController = require('../controllers/products')



// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get('/', productController.getProducts)

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
router.get('/:id', productController.getProduct)

module.exports = router
