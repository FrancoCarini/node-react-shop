const AppError = require('../utils/appError')

const errorHandler = (err, req, res, next) => {
  let error = {}
  error.statusCode = err.statusCode
  error.message = err.message

  //Mongoose Bad Object ID
  if(err.name === 'CastError') error = new AppError(`Invalid ${err.path}: ${err.value}.`, 400)

  //Mongoose duplicate key
  if(err.code === 11000) {
    const entries = Object.entries(err.keyValue)
    let msg = '';
    entries.forEach(entry => msg+= `${entry[0]}: ${entry[1]} `)
    error = new AppError(`Duplicate Field ${msg.trim()}`, 400)
  }

  //Mongoose validation error
  if(err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data: ${errors.join('. ')}`
    error = new AppError(message, 400)
  }

  if (error.name === 'JsonWebTokenError') error = new AppError('Invalid Token. Please login again.', 401)

  if (error.name === 'TokenExpiredError') error = new AppError('Token Expired. Please login again.', 401)

  console.log(`Status Code es: ${error.statusCode}`)

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler
