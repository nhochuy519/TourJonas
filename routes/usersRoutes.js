
const express = require('express')


const {signup, login,protect,forgotPassword,
    resetPassword,updatePassword} = require('../controller/authController')


const router = express.Router();

const {
    getAllUsers,
    // createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe
    
    
 // eslint-disable-next-line node/no-unpublished-require
 } = require('../controller/userController')



// users
//router.param('id')


router.post('/signup',signup)
// bởi vì tuyến đường /signu chỉ có duy nhất là đăng ký nên chỉ 
// dùng duy nhất post không cần route
// router
//     .route('/signup')
//     .get(signup)

router.post('/login',login)

router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)

router.patch('/updateMyPassword',protect,updatePassword)


router.patch('/updateMe',protect,updateMe)
router
    .route('/')
    .get( getAllUsers)
    // .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports=router