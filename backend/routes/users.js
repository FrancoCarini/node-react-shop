const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { protect, restrictTo } = require('../middleware/auth') 

router
  .route('/')
    .post(userController.signup)
    .get(protect, restrictTo('admin'), userController.getUsers)

router
  .post('/login', userController.login)

router
  .route('/profile')
    .get(protect, userController.getUserProfile)
    .put(protect, userController.updateUserProfile)
router
  .route('/:id')
    .delete(protect, restrictTo('admin'), userController.deleteUser)
    .get(protect, restrictTo('admin'), userController.getUserById)
    .put(protect, restrictTo('admin'), userController.updateUser)

module.exports = router
