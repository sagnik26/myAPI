const express = require('express')
const tourController = require('../controller/tourController')
const authController = require('./../controller/authController')

const router = express.Router()

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.postTour)


router
    .route('/:id')
    .get(tourController.getTour)
    .delete(tourController.deleteTour)
    .patch(tourController.updateTour)


module.exports = router


