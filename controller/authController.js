
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User =require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id => jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN // thiết lập hạn hết hạn jwt
    })

const signup = catchAsync(async(req,res,next)=> {

    /*
        token" là một đơn vị dữ liệu nhỏ được sử dụng để đại diện cho 
        quyền truy cập hoặc thông tin nhận dạng trong một hệ thống.

    */
    // name :req.body.name,
        // email:req.body.email,
        // password:req.body.password,
        // passwordConfirm : req.body.passwordConfirm,
        // passwordChangeAt:new Date(req.body.passwordChangeAt)
    const newUser = await User.create(req.body)
    //                         payload           secret
    const token = signToken(newUser._id)
    /*
        payload
         secret : mật mã bí mật dùng để mã hoá
        options JWT_EXPIRES_IN = 80d 10h 5m 3s  chỉ đỉnh thời gian jwt hết hạn
    */
    console.log( req.body.passwordChangeAt)
    res.status(201).json({
        status:'succces',
        token,
        data:{
            user:req.body
        }
    })

})

const login = catchAsync(async(req,res,next) =>{
    const {email,password}=req.body;

    // 1 ) kiểm tra nếu pasword hoặc email trống
    if(!email || !password) {
        return next(new AppError('Please provide email and password!',400));
    }
    //2) kiểm tra xem user và password 
    
    const user = await User.findOne({"email":email}).select('+password');
    console.log(user);
    const correct = await user.correctPassword(password,user.password)


    if(!user || !correct) {
        return next(new AppError('Incorrect email or password',401))
    }
    const token =signToken(user._id);

    res.status(200).json({
        status:'success',
        token
    })
})



const protect = catchAsync(async(req,res,next)=>{
    //1) nhận token và kiểm tra xem có nó ở đó không
    console.log('xử lý middelware protect')
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    
        token = req.headers.authorization.split(' ')[1];
       
    }
    console.log(token)

    if(!token) {
        return next(new AppError('Your are not logged in! Please log in to get access',401))
    }
  
    // 2) Xác minh token 
    // hàm verify này là hàm không đồng bộ
    const decoded = await jwt.verify(token,process.env.JWT_SECRET);
    console.log(decoded)
    /*
        { 
            id: '65ff0256b9816676585214ee',
             iat: 1711259483, ngày tạo
             exp: 1718171483  ngày hết hạn
        }
    */


    

    // 3)kiểm tra nếu user có tồn tại hay không như là người dùng bị xoá mà jwt vẫn còn tồn tại
    // kiểm tra id user nếu k còn tồn tại thì trả về lỗi
    // tránh trường hợp user đã bị xoá nhưng jwt thì vẫn còn tồn tại
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser)
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer',401))
    }
  



    //4) kiểm tra nếu user thay đổi mật khẩu sau khi jwt đã được ban hành
    if(currentUser.changedPasswordAfter(decoded.iat) ) {
        return next(
            new AppError('User recently changed password! Please log in again',401)
        )
    }
    // iat đại diện cho thời điểm token được tạo ra
    req.user=currentUser
    next()
})







const restrictTo = (...roles)=>(req,res ,next)=>{
        // roles ['admin,'lead-guile'] chỉ có 2 thằng được truy cập và xoá sản phẩm
        if(!roles.includes(req.user.role) ){
            return next(new AppError('You do not have permission to perform this action',403))
        }
        next();
    }


const forgotPassword = catchAsync(async(req,res,next)=>{
    //1) lấy người dùng dựa trên email đã đăng
    const user = await User.findOne({email:req.body.email})
    if(!user) {
        return next(new AppError('There is no user with email address',404))
    }

    //2) tạo ra mã token ngẫu nhiên
    const resetToken = user.createPasswordResetToken();
    await user.save();
    //3) gửi lại dưới dạng email

    const resetURL = `${req.protocal}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`

    const message =`Forgot your password? Submit a PATCH request with tour new passowrd and passwordConfirm to ${resetURL}.\n 
    If tou didn't forget your password, plesae ignore this email
    `
    try {
        const info = await sendEmail({
            email:user.email,
            subject:'Your pasword reset token(valid for 10 min)',
            message,
    
        });
        res.status(200).json({
            status:'success',
            message:'Token sent to email',
            info,
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return next(new AppError('There was an error sending the email. Try again later'),500)
    }
    
    
})

const resetPassword = catchAsync(async(req,res,next)=>{
    //1) có được người dùng dựa trên token
        /*
            crypto.createHash('sha256'): Tạo một đối tượng mã hóa sử dụng thuật toán băm SHA-256.
            .update(req.params.token): Cung cấp dữ liệu cần mã hóa cho đối tượng mã hóa. Trong trường hợp này, req.params.token là dữ liệu cần được mã hóa.
            .digest('hex'): Trả về kết quả băm dưới dạng chuỗi hexadecimals (hex).
        */
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gte:Date.now()}})
    // 2) tạo lại mật khẩu nếu như token chưa hết hạn
        if(!user) {
            return next(new AppError('Token is invalid or has expired',400))
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires=undefined;
        await user.save()

    // 3) Update changedPasswordAt property cho user
        // trong middleware mongoose
    //4) đăng nhập người , gửi lại mã token 
    const token =signToken(user._id);

    res.status(200).json({
        status:'success',
        token
    })

    
})

const updatePassword = catchAsync(async(req,res,next)=>{
    
    // 1) lấy ra user trong collection
     const getUser = await User.findById(req.user._id).select('+password');

    //2) kiểm tra password
    if(! (await getUser.correctPassword(req.body.passwordCurrent,getUser.password))) {
        return next(new AppError('Your curent pasword is wrong',401))
    }
 
    //3) nếu đúng chỉnh sửa lại mật khẩu
    getUser.password= req.body.password;
    getUser.passwordConfirm= req.body.passwordConfirm;
    await getUser.save()
    // không dùng User.findByIdAndUpdate được vì các trình xác thực hay middleware pre('save') sẽ không hoạt động
    const token = signToken(getUser._id)
    //4) đăng nhập, gửi lại mã jwt
    res.status(200).json({
        status:'success',
        token,
    })

})
module.exports ={
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
}