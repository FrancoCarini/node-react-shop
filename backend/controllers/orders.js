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

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  res.json(order)
})

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  order.isPaid = true
  order.paidAt = Date.now()
  const updatedOrder = await order.save()
  res.json(updatedOrder)
})

exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})
