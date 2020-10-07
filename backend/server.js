const express = require('express')
const dotenv = require('dotenv')
const products = require('./data/products')
const connectDB = require('./config/db')

dotenv.config()

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('API is running ...')
})

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id)
  res.json(product)
})

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running on ${port}`))
