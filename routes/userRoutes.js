const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser)


module.exports = router
