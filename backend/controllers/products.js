const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/appError')

// @desc Fetch all products
// @route GET /api/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return next(new AppError(`Product Not Found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(product)
})
