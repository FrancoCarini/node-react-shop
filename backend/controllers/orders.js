const Order = require('../models/Order')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/appError')

exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems, 
    shippingAddress, 
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body

  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items', 400))
  }

  const order = new Order({
    user: req.user._id,
    orderItems, 
    shippingAddress, 
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  })

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
})
