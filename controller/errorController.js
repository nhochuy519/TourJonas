const AppError = require('../utils/appError')

const handleCastErrorDB = (err) =>{
    const message =  `Invalid ${err.path} : ${err.value}`
    console.log(err.name)
    return new AppError(message,400)
}

const handleCastFieldsDB = (err) =>{
    const value = err.keyValue.name;
    console.log(value)
    const message = `Duplicate field value ${value} Please use another vallue`;
    return new AppError(message,400)
}
const handleValidationErrorDB =(err,res) =>{

    const errors = Object.values(err.errors).map((item)=>item.message)

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message,400)
}
const handleJWTError =() =>new AppError('Invalid token, Please log in again',401)

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again',401)

const sendErrorDev =(err,res) => {
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    })
}



const sendErrorProd = (err,res) =>{
    // lỗi do người dùng Operational

    if(err.isOperational) {
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
            
        })
    }
    // lỗi Programing erros (loại lỗi trong quá trình lập trình)
    // khi không muốn show quá nhiều chi tiết lỗi cho khách hàng
    else {
        // 1) log err
        console.error('Error',err)
        //2) send generic 
        res.status(500).json({
            error:err,
            status:'error',
            message:'Something went very wrong!'

        })
    }
    
}
const globalErrorHandler = (err,req,res,next)=>{
    // console.log(err.stack); // chỉ ra lỗi đang ở đâu
    console.log(err.name)

    /*
        Trong JavaScript, thuộc tính stack của một đối tượng Error là một
        chuỗi chứa thông tin về ngăn xếp (stack trace) tại thời điểm lỗi
        xảy ra. Stack trace là một danh sách các dòng mã nguồn đã được 
        thực thi từ các hàm và phương thức, giúp bạn xác định nơi mà lỗi 
        đã xảy ra.

    */
    console.log('thực hiện bắt lỗi ở app có err middelware cuối cùng')
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error';

        if(process.env.NODE_ENV === 'development') {
            console.log('thực hiện sửa lỗi development')
           sendErrorDev(err,res)
        }
        else if(process.env.NODE_ENV === 'production') {
            console.log('thực hiện sửa lỗi production')
            console.log(err.name)
            if(err.name ==='CastError'){
                err = handleCastErrorDB(err)
            }
            if(err.code === 11000) {
                console.log(err.code)
                err= handleCastFieldsDB(err)
            }
            if(err.name ==="ValidationError") {
                err = handleValidationErrorDB(err)
            }
            if(err.name ==='JsonWebTokenError') {
                err = handleJWTError(err)
            }
            if(err.name === 'TokenExpiredError') {
                err = handleJWTExpiredError()
            }


            sendErrorProd (err,res)
        }


   
}


module.exports ={
    globalErrorHandler
}