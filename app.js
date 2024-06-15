const express = require('express');
// app đại diện cho ứng dụng web của bạn
/*
  Nó là nơi bạn định nghĩa các tuyến đường (routes), middleware, 
  cấu hình và các tính năng khác của ứng dụng. app chịu trách nhiệm cho
   việc xử lý các yêu cầu HTTP và phản hồi tương ứng từ phía server.  
*/
const app = express();
const fs = require('fs');
const morgan = require('morgan')

const AppError = require('./utils/appError')
// chạy env

// eslint-disable-next-line import/extensions
const tourRouter = require('./routes/tourRoutes');
// eslint-disable-next-line import/extensions
const usersRouter = require('./routes/usersRoutes');

// errorController
const {globalErrorHandler} = require('./controller/errorController')

// middleware

// ghi log format 

//Thư viện morgan 
    /*
        
    Thư viện Morgan là một middleware cho Express.js, được sử dụng để ghi log 
    (ghi lại thông tin) về các yêu cầu (requests) và các phản hồi (responses)
    trong ứng dụng web của bạn. Khi tích hợp Morgan vào ứng dụng Express.js 
    của bạn, nó sẽ tự động ghi lại thông tin về các yêu cầu được thực hiện,
    giúp bạn theo dõi và phân tích hành vi của ứng dụng.
    

    */

// kết hợp sử dụng với process.env (variable environment : biến môi trường)
console.log(process.env.NODE_ENV);


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')) // có màu sắc
    // app.use(morgan('tiny')) // không có màu sắc
}


/*
    // các middleware sẽ áp dụng cho tất cả các yêu cầu

    // app.use((req,res,next)=>{
    //     console.log(`Middleware1 ${req.method} ,${req.url}`);
    //     next();
    // });

    // app.use((req,res,next)=>{
    //     console.log(`Middleware2 ${req.method} ,${req.url}`);
    //     next();// chạy đến middleware tiếp theo hoạt route handle
    // });


*/



app.use(express.json());// express sẽ tự động parse(phân tích cú pháp) dữ liệu json từ body và đưa vào đối tượng req.body



/*
    // app.use((req,res,next)=>{
    //     console.log('hello from the middleware');
        
    //     // không có next thif chương trình sẽ bị kẹt ngay chỗ này
    //     next()
    // });
    // app.use((req,res,next)=>{
    //     console.log(new Date().toISOString());

    //     req.requestTime= new Date().toISOString()
    //     next();
    //     /*
            
    //         toISOString() là một phương thức trong JavaScript được sử dụng để chuyển đổi đối tượng thời gian (date) thành một chuỗi biểu diễn chuẩn theo định dạng ISO 8601. Phương thức này thuộc về đối tượng Date trong JavaScript.

    //         Ví dụ, nếu bạn có một đối tượng Date và muốn biểu diễn nó dưới dạng chuỗi theo định dạng ISO 8601, bạn có thể sử dụng phương thức toISOString() như sau:

    //         javascript
    //         Copy code
    //         const currentDate = new Date();
    //         const isoString = currentDate.toISOString();

    //         console.log(isoString);
    //         Kết quả sẽ là một chuỗi có định dạng như "YYYY-MM-DDTHH:mm:ss.sssZ", trong đó:

    //         YYYY là năm
    //         MM là tháng
    //         DD là ngày
    //         T là ký tự ngăn cách giữa ngày và thời gian
    //         HH là giờ
    //         mm là phút
    //         ss là giây
    //         sss là mili-giây
    //         Z là ký tự biểu thị múi giờ UTC
        
    //     
    //     //toISOString() là một phương thức trong JavaScript được sử dụng để chuyển đổi
    //     // đối tượng thời gian (date) thành một chuỗi biểu diễn chuẩn theo định dạng ISO 8601

    // });

*/
    


// định tuyến route (đường dẫn) http method get
// hàm send dùng để gửi
/*
    send là một phương thức của đối tượng response (res) được sử dụng để 
    gửi dữ liệu từ máy chủ đến trình duyệt hoặc client. send cung cấp một
    cách thuận tiện để phản hồi với nội dung và tự động đặt các tiêu đề 
     phản hồi phù hợp.

     status() được sử dụng để thiết lập mã trạng thái HTTP cho phản hồi. 
     Nó cho phép bạn đặt mã trạng thái trước khi sử dụng các phương thức 
     send, json, hoặc các phương thức phản hồi khác.
*/



/*
// app.get('/',(req,res)=>{
//      res.status(200).send('Xin chào lời chào đến từ server side')
// });

    // app.get('/obj',(req,res)=>{
//     console.log('đang chạy')
//     res.status(200).json(
//         {
//             name:"Phan Minh Huy",
//             age:18
//         }
//     )
// })

// phương thức post
// app.post('/',(req,res)=>{
//     res.send('bạn có thể post')
// })


*/



// đặt public là thư mục gốc như chúng ta đã xác định
app.use(express.static('./public'));
/*
    // truy cập file html overview
    http://localhost:5500/overview.html
*/
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',usersRouter);

// cách để use file html vào



// eslint-disable-next-line no-lone-blocks
// app.use((req,res,next)=>{{
//     res.status(400).send('không tìm thấy')
// }})

// all được dùng để xử lý các yêu cầu HTTP (GET, POST, PUT, DELETE)
// * dược sử
//req.originalUrl in ra url được yêu cầu

// xử lý lỗi vận hành
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server`
    // })
    
    // const err = new Error(`Can't find ${req.originalUrl} on this server`)
    // err.status='fail';
    // err.statusCode=404;

    // khi truyền đói số vào next là một lỗi thì nó sẽ ngay lập tức 
    // bỏ qua hết các middel ware không xử lý lỗi để vào ngay phần middle xử lý lỗi để thực thi
    // next(err);
    console.log('thực hiện bắt lỗi ở app use có err*')
       next(new AppError(`Can't find ${req.originalUrl} on this server`,404))

    
})
// app.all('*',(req,res,next)=>{
//     // res.status(404).json({
//     //     status:'fail',
//     //     message:`Can't find ${req.originalUrl} on this server`
//     // })
//     console.log('không bỏ qua')
    
//     next();
// })


app.use(globalErrorHandler)

// start server


module.exports = app;