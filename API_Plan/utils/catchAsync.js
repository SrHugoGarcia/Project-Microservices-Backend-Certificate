const catchAsync = recibeFuncion =>{
    return (req,res,next)=>{
        recibeFuncion(req,res,next).catch(next);
    }
};

module.exports = catchAsync;