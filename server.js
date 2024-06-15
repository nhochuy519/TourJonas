const mongoose = require('mongoose');

require('dotenv').config({path:'./.env'});

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
const server =app.listen(port,()=>{
    console.log(`App đang được chạy trên port ${port}`);
});

// sự kiện unhandleRejection được phát ra mỗi khi có bất cứ promise nào bị reject ( từ chối) 

process.on('unhandledRejection',(reason,promise)=>{
    // console.log('ly do',reason);
   // nếu có vấn đề gì với ưng dụng thì ta có thể tắt nó đi
   //process.exit(0) 0 có nghĩa thành công
   // 1 có nghĩa thất bại
   console.log('unhandler rejection  Shutting down ')
   server.close(()=>{ // đóng server  để ngừng lắng nghe các kết nối mới và đóng máy chủ.
    process.exit(1);  // tắt ứng dụng
   })
 
   /*
    server.close() chỉ dừng việc lắng nghe kết nối mới, không chặn các kết 
    nối hiện tại từ việc hoàn thành. Để ngừng toàn bộ máy chủ và ngăn chặn
     tất cả các kết nối, bạn có thể xem xét cách sử dụng các biểu thức như 
     process.exit() hoặc các phương pháp quản lý đặc biệt khác tùy thuộc vào 
     ngữ cảnh ứng dụng của bạn.
   
   
   */
})

// bất cứ lỗi hay bug nào mà chưa được xử lý ngoại lệ thì sẽ nhảy vào đây để xủ lý



// console.log(x)


// TEST








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
