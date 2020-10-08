const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Data 
const users = require('./data/users')
const products = require('./data/products')

const connectDB = require('./config/db')


//Load env vars
dotenv.config()

//Load Models   
const User = require('./models/User')
const Product = require('./models/Product')
const Order = require('./models/Order')

//Connect to DB
connectDB()

//Import into DB
const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map(product => {
      return {...product, user: adminUser}
    })

    await Product.insertMany(sampleProducts)

    console.log('Data imported ...')
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

//Delete Data
const deleteData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    console.log('Data destroy ...')
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if(process.argv[2] === '-i') {
  importData()
} else if(process.argv[2] === '-d') {
  deleteData()
}
