 
const fs = require('fs');
const User =require('../models/userModel');

const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

const  filterObj = (obj,...allowedFields) =>{
    const newObj = {}
    Object.keys(obj).forEach(item=>{
        if(allowedFields.includes(item)) {
            newObj[item]=obj[item]
        }
    })
    
    return newObj
}

 const getAllUsers =catchAsync (async(req,res)=>{

 


    const user = await User.find();

    // SEND QUERY
    res.status(200).json({
        status:'success',
        results:user.length,
        data:{
            user,
        }
    })
 })
 

const updateMe = catchAsync( async(req,res,next) => {
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use / updateMyPassword',400));

    }
    const user2 = await User.findById(req.user._id)
    console.log('req body la',req.body)
    const filteredBody = filterObj(req.body,'name','email');
    console.log('filteredBody la',filteredBody)
    const updateUser = await User.findById(req.user._id,filteredBody,{new:true, runValidators:true});
    
    res.status(200).json({
        status:'success',
        data:{
            user:updateUser,
            user2
        }
    });
})



 const getUser =(req,res)=>{
     res.status(500).json({
         status:'error',
         message:'this route is not yet defined'
     })
 }
 const updateUser =(req,res)=>{
     res.status(500).json({
         status:'error',
         message:'this route is not yet defined'
     })
 }
 const deleteUser =(req,res)=>{
     res.status(500).json({
         status:'error',
         message:'this route is not yet defined'
     })
 }


 module.exports = {
    getAllUsers,
    // createUser,a
    getUser,
    updateUser,
    deleteUser,
    updateMe
 }