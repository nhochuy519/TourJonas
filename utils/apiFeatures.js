


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


module.exports=APIFeatures