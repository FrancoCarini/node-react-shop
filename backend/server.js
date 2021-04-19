const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const AppError = require('./utils/appError')
const errorHandler = require('./middleware/errors')

//Routes
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/users')
const orderRoutes = require('./routes/orders')

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

// Mount Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404))
})

app.use(errorHandler)

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running on ${port}`))
