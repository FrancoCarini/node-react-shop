const asyncHandler = require('express-async-handler')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/appError')

// Generate token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  // Since user is returned set password undefined in user object
  user.password = undefined

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  // In production mode add secure field to true
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  res.status(statusCode).json({
    token,
    user
  })  
}

exports.signup = asyncHandler(async (req, res) => {
  const {name, email, password, passwordConfirm} = req.body

  // Create user in DB
  const newUser = await User.create({
    name,
    email,
    password
  })

  // Generate JWT Token and send
  createSendToken(newUser, 201, res)
})

exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body

  // Check if email and password are in request
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // Check if exists user with that email
  const user = await User.findOne({email}).select('+password')
  if (!user) return next(new AppError('Incorrect email or passowrd', 401))

  // Check if password match
  const isCorrectPassword = await user.correctPassword(password, user.password)
  if (!isCorrectPassword) return next(new AppError('Incorrect email or passowrd', 401))

  createSendToken(user, 200, res)
})

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if(!user) {
    return next(new AppError(`No user with id ${req.params.id}`, 404))
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    return next(new AppError(`No user with id ${req.params.id}`, 404))
  }
  
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  if (req.body.password) {
    user.password = req.body.password
  }

  const updatedUser = await user.save()

  createSendToken(updatedUser, 200, res)
})

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError(`No user with id ${req.params.id}`, 404))
  }

  await user.remove()
  res.status(200).json({ message: 'User removed' })
})

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    return next(new AppError(`No user with id ${req.params.id}`, 404))
  }

  res.status(200).json(user)
})

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError(`No user with id ${req.params.id}`, 404))
  }
  
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  user.isAdmin = req.body.isAdmin

  const updatedUser = await user.save()

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  })
})
