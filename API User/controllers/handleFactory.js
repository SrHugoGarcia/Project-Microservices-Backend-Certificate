const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')
const APIFeature = require("../utils/apiFeature");


const deleteOne = Model => catchAsync(async(req,res,next)=>{

    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) return next(new AppError("No se encontro el documento con esa identificacion",404));

    res.status(204).json({
        status: "Successful",
        data: doc,
        message: "Documento eliminado"
        });
});


const updateOne = Model => catchAsync(async(req,res,next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new: true, //Para que nos devuelva el nuevo documento
        runValidators: true, //Para que nos corran los validadores que estan en nuestro squema
    });
    if(!doc) return next(new AppError("No se encontro el documento con esa identificacion",404));
    res.status(201).json({
        status: "successful",
        data: {
            data: doc
        }
    });
});

const createOne = Model => catchAsync(async (req,res,next)=>{
    const newDoc = await Model.create(req.body)
        res.status(201).json({
            status: "successful",
            data: {data: newDoc},
        })
});

const getOne =(Model, populateOptions)=>catchAsync(async(req,res,next)=>{
    const _id = req.params.id;
    let query = Model.findById(_id)
    if(populateOptions) query = query.populate(populateOptions);
    const doc = await query
    
    if(!doc) return next(new AppError("No se encontro un documento con esa identificacion",404));
    res.status(200).json({
        status: "sucess",
        requestAt: req.requestTime,
        data: {data: doc}
    })    
});

//Api, version de la api
//usaremos el formato estandar jsend JSON para enviar la respuesta

const getAll = Model => catchAsync(async(req,res)=>{
    let filter= {
    }
    //EJECUTANDO LA CONSULTA
    // console.log(req.query)
   const features = new APIFeature(Model.find(filter),req.query).filter().sort().limitFields().paginate();
   //const doc = await features.query.explain();
   const doc = await features.query;
//ENVIANDO RESPUESTA
   res.status(200).json({
       status: "successful",
       results: doc.length,
       requestAt: req.requestTime,
       data: {data: doc}
   });   
});


module.exports = {deleteOne, updateOne, createOne, getOne, getAll}