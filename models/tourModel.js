
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// định nghĩa mô hình(model)
const tourSchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true,"A tour must have a name"], // bắt buộc, chỉ định lỗi mà chúng ta muốn hiển thị
        unique:true, // ràng buộc duy nhất
        trim:true,
        // các giá trị dưới đây dành cho chuỗi
        maxlength:[40,'A tour name must have less or equal then 40 character'],
        minlength:[10,'A tour name must have more or equal then 10 character'],
        // validate:[validator.isAlpha,'Tour name must only contain character']
    },// thiết lập nhiều options cho field name
    slug:String,
    // duration : thời lượng , khoảng thời gian
    duration: {
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize: {
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty: {
        type:String,
        required:[true,'A tour must have a diffculty'],
        // enum: liệt chỉ dành cho chuõipo        
        // enum:'easy','medium','difficult']
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty is either:easy,medium,dificult'
        }// thiết lập các giá trị được phép thêm vào
        
    },
    ratingsAverage:{
        type:Number,
        default:4.5,// khởi tại giá trị mặc định là 4,5
        // các giá trị dưới đây vẫn có thể hoạt động với date
        min:[1,'rating must be above 1.0'],
        max:[5,'rating must be below 5.0']
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required: [true,"A tour must ha ve a price"] 
    },
    // giảm giá
    priceDiscount:{
       type: Number,
        validate:{
        validator:function(val) {
            // val chính là giá trị của biến priceDiscount khi bạn thêm
            // this này đang trỏ đến document hiện tại đang xử lý
            
            // chỉ hoạt động khi tạo tài liệu mới
            // hoạt động khi save, khi tạo đối tượng mới ,
            return val <this.price  ;
        },
        // ({VALUE}) cho phép truy cập vào giá trị val tức là giá trị của priceDiscount
        message:'Discount price ({VALUE})should be below regular price'
       }
    } ,
    // tóm tắt
    summary:{
        type:String,
        trim:true ,// loai bỏ khoảng trắng
        required:[true,'A tour must have a description']
    },
    description: {
        type:String,
        trim:true
    },
    // ảnh bìa
    imageCover:{
        type:String,
        require:[true,'A tour must have a cover image']
    },
    // lưu ảnh dưới dạng mảng string
    images:[String],
    // thời điểm người dùng có chuyển tham quan mới
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false // nếu giá trị này là false thì khi truy vấn trường này sẽ không xuất hiện
    },

    // ngày bắt đầu
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
// phương thức ảo sẽ được hiện lên khi chuyển đổi sang json
// phương thức ảo sẽ được hiện lên khi chuyển đổi sang Object
// tạo model , tour chính là model

// tạo hàm ảo
// get sẽ được gọi khi bạn truy xuất thuộc tính ảo

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})

// thuộc tính nầy không phải là một phần của cơ sở dữ liệu nên không thể dùng nó để truy vấn



// document middleware được chạy trước khi lệnh .save() và .create() nhưng với insertMany thì không
// .pre được sử dụng để chỉ các hàm middleware hoặc hooks mà sẽ được thực thi trước khi một sự kiện cụ thể xảy ra
/*
    Trong Mongoose, khi bạn định nghĩa các mô hình (models), bạn có thể sử dụng validator để kiểm tra tính hợp lệ của dữ 
    liệu trước khi nó được lưu vào cơ sở dữ liệu. Tuy nhiên, mặc định, validator không hoạt động khi bạn cập nhật (update) 
    tài liệu.

    Để sử dụng validator cho cả tạo mới và cập nhật (update), bạn có thể sử dụng tùy chọn {runValidators: true} khi gọi các phương 
    thức save() hoặc findOneAndUpdate(). Điều này bắt buộc Mongoose chạy validator ngay cả khi bạn thực hiện cập nhật dữ liệu.


*/
tourSchema.pre('save',function(next){
    // console.log(this)
    this.slug = slugify(this.name,{lower:true});
    
    next()// tương tự middle ware của express
})


// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('save',function(next){
//     console.log('will save document');
//     next()
// })

// đọc thêm các sự kiện tại đây https://mongoosejs.com/docs/middleware.html
// được thực hiện sau khi lưu vào document
// eslint-disable-next-line prefer-arrow-callback
// tourSchema.post('save',function(doc,next){
//     console.log(doc);// sẽ được in ra tài liệu sau khi lưu   
//     next()// tương tự middle ware của express
// })


// QUERY MIDDLEWARE
// hook sẽ chạy với bất kì truy vấn nào bắt đầu bằng find
tourSchema.pre(/^find/,function(next){
    console.log("chạy middle trước khi truy vấn find-")
   
    this.find({secretTour:{$ne:true}});
    this.start =Date.now() // lấy thời điểm hiện tại
    next();
})


// hook này sẽ được chạy sau khi đã thực hiện truy vấn find()
// eslint-disable-next-line prefer-arrow-callback
tourSchema.post(/^find/,function(docs,next){
    // docs lúc này cho phép chúng tra truy cập về kết quả truy vấn trả về
    console.log('chạy middel sau khi truy vấn find xong')
    console.log(`Thời gian truy vấn ${Date.now() - this.start} miliseconds`)
    
    // console.log(docs)
    next();
})
 

// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate',function(next){
    // console.log(this)// in ra các toán tư truy vấn

    // unshift thêm vào đầu mảng
    // xem thêm cách làm việc với mảng trong js
    this.pipeline().unshift({
        "$match": {
            secretTour:{$ne:true}
        }
    })

    next();
})

// tourSchema.post('aggregate',function(docs,next){
//     console.log('cập nhập chuyển đổi aggregation thành công');
//     console.log(docs)
//     next();
// })

 
const  Tour = mongoose.model('Tour',tourSchema);

module.exports=Tour;
