// const mongoose = require('mongoose')
// require('dotenv').config()
// const Tour = require('./models/tourModel')

// const DB =process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

// // kết nối database
// mongoose
//     .connect(DB)
//     .then((con)=>{
//         console.log('kết nối thành công')
//         // console.log(con.connections)
//     })

// class Api {
//     constructor(query,queryString) {
//         this.query=query
//         this.queryString=queryString
//     }

//     filter() {
//         this.query.find()
//         return this
//     }

//     sort() {
//         this.query.select(this.queryString);
//         return this
//     }
// }

// const run =async()=>{
//     const createApi = new Api(Tour.find(),'name duration');

//     createApi.filter()
//     createApi.sort()

//     const tour = await createApi.query;

//     console.log(tour)

// }

// run()



// try {
//     const queryObj ={...req.query};
//     const excludeFiels = ['page','sort','limit','fields'];
//     excludeFiels.forEach((item)=> delete queryObj[item])

//     let queryStr = JSON.stringify(queryObj);
//     queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);

//     let query = Tour.find(JSON.parse(queryStr));
    

//     if(req.query.sort) {
//         console.log('thực hiện')
//         query = query.sort(req.query.sort)
//     }

    
//     const tour = await query;

//     res.status(200).json({
//         status:'success',
//         length:tour.length,
//         tour,
//     })
// }
// catch (err) {
//     console.log(err)
//     res.status(404).json({
//         status:'fail',
//         message: err
//     })
// }


/*
    "2024-02-19": Ngày 19 tháng 2 năm 2024.
    "T": Dấu "T" được sử dụng để phân tách phần ngày và phần giờ trong chuỗi.
    "11:04:32.344": Thời gian 11 giờ, 4 phút, 32 giây và 344 miligiây.
    "Z": Ký tự "Z" đại diện cho múi giờ UTC (Coordinated Universal Time). Nếu có "Z" ở cuối, nó cho biết thời gian đã được chuyển đổi về UTC.

*/
// const b = new  Date("2024-02-19T11:04:32.344Z")
// const a  = new Date('2024-03-01');
// console.log(a);
// console.log(b)
// console.log(a>b)

const crypto = require('crypto')

const resetToken = crypto.randomBytes(32).toString('hex');

const hasg =crypto.createHash('sha256').update(resetToken).digest('hex');

console.log(resetToken);
console.log(hasg)

const time = Date.now();
console.log(time)
