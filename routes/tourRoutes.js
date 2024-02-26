
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
    .get(getAllTours)
    .post(createTour);
    // .post(checkBody,createTour);
router
    .route('/:id') // tương đương /api/v1/tours/:id
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)


module.exports=router;

