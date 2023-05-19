class APIFeature{
    //Se analizara el query de mongoose Tour.find() y el obQjueryString de express req.query
    constructor(query,objQueryString){
        this.query = query;
        this.objQueryString = objQueryString;

    }
    filter(){
        const objQuery = {...this.objQueryString};
        //pagina, ordenacion, limite, cmapos
        const camposExcluidos = ["page", "sort", "limit","fields"];
        camposExcluidos.forEach(el=> delete objQuery[el]);
      
        let queryStr =JSON.stringify(objQuery);
        queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, match=> `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }
    sort(){
        if(this.objQueryString.sort){
            const sortBy = this.objQueryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort("-createAt email")
        }
        return this;
    }
    limitFields(){
        if(this.objQueryString.fields){
            const fields = this.objQueryString.fields.split(",").join(" ");
            //Cuando se haga la consulta solo va a mandar al cliente aquellos datos que estan dentro de select
            this.query = this.query.select(fields)
            
        }else{
            this.query = this.query.select("-__v")
        }
        return this;
    }
    paginate(){
        const page = this.objQueryString.page * 1 || 1;
        const limit = this.objQueryString.limit *1 || 100;
        const skip = (page-1) *limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}

module.exports = APIFeature;