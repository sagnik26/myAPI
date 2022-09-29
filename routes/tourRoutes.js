const express = require('express')
const tourController = require('../controller/tourController')

const router = express.Router()


router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.postTour)


router
    .route('/:id')
    .get(tourController.getTour)
    .delete(tourController.deleteTour)
    .patch(tourController.updateTour)


module.exports = router




