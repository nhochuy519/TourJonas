

const catchAsync  = (fn) =>(req,res,next)=>{
    fn(req,res,next)
        .catch((err)=>{
            next(err) // next sẽ được chạy vào middleware có chứa xử lý lỗi
        })
   }

   module.exports = catchAsync