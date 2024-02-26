const mongoose = require('mongoose');

require('dotenv').config()
// không liên quan đến express thì ta sẽ cấu hình tại đây
const app = require('./app');

// require('dotenv').config()

// lấy giá trị biến môi trường NODE_ENV 
// thường được sử dụng để xác định môi trường làm việc của ứng dụng, chẳng hạn như "development" (phát triển), "production" (triển khai) hoặc "test" (kiểm thử).
//. Sử dụng app.get('env') có thể giúp bạn xác định môi trường hiện tại và thực hiện cấu hình tương ứng.


// console.log(app.get('env')) // in ra development
// env viết tất cho từ enviroment biến môi trường


// in ra một loạt các biến
// là một đối tượng của nodejs chứa các biến môi trường của hệ thống
// console.log(process.env)


// sử dụng mongoose

const DB =process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

console.log("huy phan")
// kết nối database
mongoose
    .connect(DB)
    .then((con)=>{
        console.log('kết nối thành công')
        // console.log(con.connections)
    })




// const testTour = new Tour(
//     {
//         name:"The Forest3",
//         rating:4.7,
//         price:497   
//     }
// )

// // lưu vào mongodb
// testTour.save()
//     .then((doc)=>{
//         console.log(doc) // in ra đối tượng ta vừa mới thêm vào database

//         console.log('Đã lưu thành công vào cơ sở dữ liệu')
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
  
const port =process.env.PORT|| 3000;
app.listen(port,()=>{
    console.log(`App đang được chạy trên port ${port}`);
});




/*
    1)Thế nào là biến môi trường

        Các biến môi trường là các giá trị được xác định để cung cấp khả năng
        có thể ảnh hưởng đến cách hoạt động của các chương trình, ứng dụng
        và dịch vụ. Chúng ta có thể sử dụng các biến môi trường để tác động
        và thay đổi cách chạy ứng dụng của mình.

    Hiểu hơn về devolopment và production Environment 

    2)development

        Môi trường phát triển là máy tính cục bộ của bạn.
        Các trình soạn thảo/IDE bạn sử dụng để viết mã. Trình biên dịch và 
        trình thông dịch mà bạn sử dụng để chạy và thực thi mã trên máy của
        mình. Hệ điều hành được cài đặt trên máy của bạn. Dung lượng và 
        khả năng kết nối của mạng cục bộ.

        Mọi thứ được cài đặt trên máy của bạn đều nằm trong môi trường phát 
        triển của bạn. Bất cứ khi nào bạn nghe ai đó đề cập đến 
        “môi trường phát triển”, hãy nhớ rằng họ đang nói về việc phát triển 
        thứ gì đó trên máy tính của họ.

    3)production

        Môi trường sản xuất là sản phẩm cuối cùng. Sản phẩm trực tiếp mà 
        khách hàng của    


*/
