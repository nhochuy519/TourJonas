
const mongoose = require('mongoose');
const slugify = require('slugify');
// định nghĩa mô hình(model)
const tourSchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true,"A tour must have a name"], // bắt buộc, chỉ định lỗi mà chúng ta muốn hiển thị
        unique:true, // ràng buộc duy nhất
        trim:true
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
        required:[true,'A tour must have a diffculty']
    },
    ratingsAverage:{
        type:Number,
        default:4.5// khởi tại giá trị mặc định là 4,5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required: [true,"A tour must have a price"] 
    },
    priceDiscount: Number,
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
        select:false
    },

    // ngày bắt đầu
    startDates:[Date]
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
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next()// tương tự middle ware của express
})


const  Tour = mongoose.model('Tour',tourSchema);

module.exports=Tour;
