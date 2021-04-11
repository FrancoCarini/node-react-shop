const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const ErrorResponse = require('./utils/errorResponse')
const errorHandler = require('./middleware/errors')

//Routes
const productRoutes = require('./routes/products')

dotenv.config()

connectDB()

const app = express()

// Mount Routes
app.use('/api/products', productRoutes)

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl}`, 404))
})

app.use(errorHandler)

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running on ${port}`))
