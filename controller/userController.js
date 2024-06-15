 
const fs = require('fs');
const User =require('../models/userModel');

const catchAsync = require('../utils/catchAsync');

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
    deleteUser
 }