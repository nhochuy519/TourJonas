const fs = require('fs')

const Tour = require('../models/tourModel');





// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));


// phần kết hợp làm với mongodb

/*
    getTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody

*/

const aliasTopTours = (req,res,next) =>{
    req.query.limit='5';
    req.query.sort='-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,sumary,difficulty';
    next()
}


class APIFeatures {
    constructor(query,queryString) {
        this.query=query;
        this.queryString=queryString
    }

    // tìm kiếm 
    filter() {
        const queryObj ={...this.queryString};
        const excludeFiels = ['page','sort','limit','fields'];
        excludeFiels.forEach((item)=> delete queryObj[item])

        

        let queryStr = JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        console.log(queryStr)
        
        this.query=this.query.find(JSON.parse(queryStr))
        return this
        //let query = Tour.find(JSON.parse(queryStr));
    }
    
    // sắp xếp 
    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy) 
            this.query = this.query.sort(sortBy)
        }else {
            this.query=this.query.sort('-createdAt')
        }
        return this
    }

    // giới hạn fields
    limitFields() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            console.log(fields)
            this.query=this.query.select(fields);

        }else {
            this.query=this.query.select('-__v') 
            
        }
        return this
    }

    //phân trang

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = limit * (page - 1) ;
        this.query = this.query.skip(skip).limit(limit)
        return this
        
    }
}





// get
const getAllTours = async(req,res) =>{
    //http://localhost:5500/api/v1/tours?duration[gte]=5&difficulty=easy
    // duration[gte]=5 có nghĩa là duration >=5
    try {
        // console.log(req.query)
        //BUILD QUERY   
        // loại bỏ truy vấn

        //1A) filtering: lọc
        // const queryObj ={...req.query};
        // const excludeFiels = ['page','sort','limit','fields'];
        // excludeFiels.forEach((item)=> delete queryObj[item])
        
        // xoá các khoá trong chuỗi truy vấn

      
           

        //1B) Advanced filtering : lọc nâng cao loc theo vd duration[gle]:5
        // let queryStr = JSON.stringify(queryObj);
        // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        // console.log(queryStr)
     
        // cách truy vấn 1
        // db.tour.find()  
        // let query = Tour.find(JSON.parse(queryStr));// trả vể các mảng tài liệu
        
            // cách truy vấn 2

            // const query =  Tour.find()
            // .where('duration')
            // .equals(5)
            // .where('difficulty')
            // .equals('easy')

        


        // 3) sorting : sắp xếp
        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     console.log(sortBy) 
        //     query = query.sort(sortBy)
        // }else {
        //     // mặc định nếu không có trường sort thì sẽ sắp xếp theo người mới vào
        //     query=query.sort('-createdAt')
        // }

        // select lựa chọn trường xuất hiện và ẩn đi
        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     console.log(fields)
        //     query=query.select(fields);

        // }else {
            
        //     query=query.select('-__v') // - để ẩn dữ liệu đó đi
            
        // }
    
        //4 ) paginatin : chức năng phân trang
    
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = limit * (page - 1) ;
    
        // // page=3&limit=10 , 1-10 page 1, 11-20 page 2 , 21-30 page 3
        // query = query.skip(skip).limit(limit)

        // if(req.query.page) {
        //     // hàm countDocuments trả về số lượng document trong collections
        //     // trả về một lời hứa
          
        //     const numTours = await Tour.countDocuments();
        //     if(skip >= numTours) {
        //         throw new Error('This page does not exists');
        //     }
        // }
        

        //EXECUTE QUERY
        const features = new APIFeatures(Tour.find(),req.query)
        console.log(features)
        features.filter()
                .sort()
                .limitFields()
                .paginate()



        const tours = await features.query;
        // query.sort().select().skip().limit()

        // SEND QUERY
        res.status(200).json({
            status:'success',
            results:tours.length,
            data:{
                tours,
            }
        })
            
    }
    catch (err) {
        res.status(404).json({
            status:'fail',
            message: err.message    
        })
    }
   

} 

// get single tour
const getTour =async(req,res)=>{
    try {
        // db.tour.findOne({_id:req.params.id}) và cách dưới là tương đồng nhau
        const tour = await Tour.findById(req.params.id);// trả vể các mảng tài liệu
        res.status(200).json({
            status:'success',
            data:{
                tour,
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

// post
const createTour=async(req,res)=>{
    // const newTour = new Tour({
    //     ...req.body
    // })
    // newTour.save();

    // cách 2
    // create trả về một promise nên ta vẫn có thể then()
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:'success',
            data :{
                Tour:newTour
            }
            
        });
    }
    catch (err) {
        res.status(400).json({
            status:'fail',
            message:"Invalid data sent!"
        })
    }
   
}
const updateTour =async(req,res)=>{
    try{

        const tour =await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status:'success',
            data:{
                tour,
            }
        })
    }catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}
const deleteTour=async(req,res)=>{
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:'success',
        })
    }catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
    
    
}

const getTourStats = async(req,res)=>{
    try {
        const stats = await Tour.aggregate(
            [
                {
                    $match :{ratingsAverage :{$gte:4.5}},
                },
                {
                    $group:{
                        // _id:null,
                        // _id:'$ratingsAverage',
                        _id:{$toUpper:'$difficulty'},// viết hoa id
                        numTours:{$sum:1},
                        numRatings:{$sum:'$ratingsQuantity'},
                        avgRating:{$avg: '$ratingsAverage'},
                        avgPrice:{$avg:'$price'},
                        minPrice:{$min:'$price'},
                        maxPrice:{$max:'$price'},

                    }
                },
                {
                    $sort:{
                        avgPrice :1 // tăng dần
                    }
                },
                {
                    $match :{_id :{$ne:'EASY'}}, //ne : not equel : không bằng
                }

                



                // {
                //     $group:{
                //         _id:'$difficulty',
                //         sumDty : {$sum:1}
                //     }
                // }

                // tính tổng số document
                // {
                //     $group: {
                //       _id: null,
                //       totalDocuments: { $sum: 1 }
                //     }
                // }
            ]
        )
        res.status(200).json({
            status:'success',
            results:stats.length,
            data:{
                stats,
            }
        })
    }
    catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        })
    }




}

const getMonthlyPlan = async(req,res)=>{
    //
    try {
        const year = req.params.year*1; // 2021
        const plan = await Tour.aggregate(
            [
                // tách các trường có array thành các object riêng biệt
                {
                    $unwind:'$startDates'
                },
                {
                    $match:{
                        startDates: {
                            $gte: new Date(`${year}-01-01`),
                            $lte : new Date(`${year}-12-31`)
                        }
                    }
                },
                {
                    $group:{
                        _id:{
                            $month:'$startDates'
                        },
                        numTourStarts:{$sum:1},
                        // thêm giá trị của  trường name vào mảng tours
                        tours:{
                            $push:'$name'
                        }
                    }
                },

                // thêm 1 trường vào
                {
                    $addFields :{
                        month:'$_id'
                    }
                },
                

                // ẩn trường k xuất hiện bằng $project
                {
                    $project:{
                        _id:0
                    }
                },

                // sắp xếp trường
                {
                    $sort:{
                        numTourStarts:-1
                    }
                },

                // giới hạn số lượng document xuất hiện
                {
                    $limit:6
                }
                
            ]

            
        );

        res.status(200).json({
            stats:'success',
            results:plan.length,
            data:{
                plan,
            }
        })
        
    } catch (err) {
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

// Phần luyện tập với json
// const checkID = (req,res,next,value) =>{
        // value là giá trị của tham số id
//     if(req.params.id >= tours.length) {
//         return res.status(400).json(
//             {
//                 status:'fail',
//                 message:'Không có người dùng đó'
//             }
//         )
//     }
//     next()
// }

// const checkBody = (req,res,next) =>{
//     if(req.body.name && req.body.price) {
//         return next();
//     }
//     res.status(400).json({
//         status:'fail',
//         message:'missing something'
//     })
// }



// const getAllTours = (req,res) =>{
//     console.log(`xử lý yêu cầu get trong url ${req.url}`)
//     console.log('Thời gian yêu cẩu',req.requestTime)
//     res.status(200).json({
//         status:'success',
//         requestTime:req.requestTime,
//         result:tours.length,
//         data :{
//             tours,
//         }
//     })
// }
// const createTour = (req,res) => {
//     const newId = tours[tours.length-1].id+1;
//     const newTours = {
//         id:newId,
//         ...req.body
//     }
//     tours.push(newTours);

//     fs.writeFile(`./dev-data/data/tours-simple.json`,JSON.stringify(tours, null, 2),err=>{
//         if(err)
//         {
//             return res.status(400).json({
//                 status:'fail',
//                 message:'thất bại'
//             })
//         }
            

//         res.status(201).json({
//             status:'success',
//             data:{
//                 tour:newTours,
//             }
//         })
        
//     })
// }

// const getTour = (req,res) =>{
//     const id= +req.params.id;
//     const tour = tours.find((item)=>item.id === id )
//     res.status(200).json({
//         status:'success',
//         data :{
//             tour,
//         }
        
//     })
// }

// const updateTour = (req,res) =>{

//     res.status(200).json({
//         status :'succes',
//         data:{
//             tour:'<Update tour here...>'
//         }
//     })
// }

// const deleteTour = (req,res) =>{
//     res.status(200).json({
//         status :'succes',
//         message:'Xoá thành công'
//     })
// }

module.exports = {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours ,
    getTourStats,
    getMonthlyPlan

}