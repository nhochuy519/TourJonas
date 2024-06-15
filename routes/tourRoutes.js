
const express = require('express');


const router = express.Router();

// controller
const {getAllTours
    ,createTour
    ,getTour
    ,updateTour
    ,deleteTour,
    checkID,
    checkBody,
    aliasTopTours,
    getTourStats ,
    getMonthlyPlan
} =require('../controller/tourController')



const {
    protect,
    restrictTo
 } = require('../controller/authController')

// xử lý middleware khi có tham số đến
// router.param('id',checkID)


router
    .route('/top-5-cheap')
    .get(aliasTopTours ,getAllTours);



router 
    .route('/tour-stats')
    .get(getTourStats)
router
    .route('/monthly-plan/:year')
    .get(getMonthlyPlan)
router
    .route('/') // tương đương /api/v1/tours
    .get( protect,getAllTours)
    .post(createTour);
    // .post(checkBody,createTour);
router
    .route('/:id') // tương đương /api/v1/tours/:id
    .get(getTour)
    .patch(updateTour)
    .delete(protect,restrictTo('admin','lead-guide'),deleteTour)


module.exports=router;

