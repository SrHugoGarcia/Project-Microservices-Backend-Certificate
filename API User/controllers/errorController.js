const AppError = require("../utils/AppError");

const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack: err.stack
    })
}
const sendErrorProduccion = (err,res)=>{
    //Si es un error operacion le mandamos los detalles al cliente
    if(err.isOperacional){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }else{
        //console.error('ERROR',err);
        //Si es un error de codigo o programacion o de las librerias etc, no le mandamos ningun detalle al cliente si no un mensaje generico
        res.status(500).json({
            status: 'error',
            message: 'Algo salio muy mal'
        })
        //AQUI COMO YA MANEJAMOS LOS POSIBLES ERRORES QU EPODRIAMOS TENER Y SE LLEGARA A ESTE PUNTO PODRIA CONFIGURAR AQUI PARA QUE ME MANDEN UN CORREO
        //CUANDO EL SERVIDOR SE CAIGA
    }
    
}
//Funcion para mandar le message de el  error que tenemos en mongoose( un id no es valido)
const handleCastErrorDB = err =>{
    message =`Invalido ${err.path}: ${err.value}.`;
    //400 error de mongoose
    return new AppError(message,400);
}
//Funcion para mandar le message de el  error que tenemos en mongoose( fields duplicado)
const handleDuplicateFieldsDB= err =>{
    message = `Ya existe: ${ err.keyValue[Object.keys(err.keyValue)[0]]}. Porfavor use otro valor`;
    return new AppError(message,400);
}
//SOlucionando errores de las validaciones en el schema
const handleValidationErrorDB = err =>{
    //RRECORREREMOS TODOS LOS ERRORES Y VAMOS A EXTRAER EL MENSAJE
    const errores = Object.values(err.errors).map(el=>el.message)
    //console.log(err);
    const message = `Datos de entrada invalidos: ${errores.join('. ')}`
    return new AppError(message,400);
}
//Solucionando cuando nos mandan incompletos los campos
const handleValidationTotalDeCamposDB = err =>{
    const message = "Los campos estan incompletos. Porfavor envia los datos completos";
    return  new AppError(message,err.status);
}
const handleErrorJWT = () =>{
    const message = "Invalido token. Porfavor inicia sesion";
    return new AppError(message,401)
}
const handleExpiredErrorJWT = err =>{
    const message = "Se ha expirado la sesion. Porfavor vuelva a iniciar sesion"
    return new AppError(message,401);
}

const erroresGlobales = (err,req,res,next)=>{
    //En dado caso que no tenga el status por default sea 500
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err,res);
    }else if(process.env.NODE_ENV === "production"){
       //Copia del parametro de error
       let error = err;
       //console.log(error.name);
       //Solucionando los 2 errores qu etenemos en mongoose, el id invalido y  un campo duplicado
               //Le pasamos el error que creo mongoose como parametro
               
               //console.log(error)
       if(error.name === "CastError") error = handleCastErrorDB(error);
        //Campo duplicado
       if(error.code ===  11000) error = handleDuplicateFieldsDB(error);
        //Solucionando los errores de las validaciones que estan en el schema
       if(error.name === "ValidationError") error = handleValidationErrorDB(error);
        //Cuando mandan incompletos los campos, ejemplo tenemos 10 campos y nada mas nos mandan 8
       if(error.type ==="entity.parse.failed" && error.expose === true) error = handleValidationTotalDeCamposDB(error);
       //Cuando el token es incorrecto
       if(error.name === "JsonWebTokenError") error = handleErrorJWT();
       if(error.name === "TokenExpiredError") error = handleExpiredErrorJWT(error);
       sendErrorProduccion(error,res)
    } 
    //next();
}

module.exports = erroresGlobales;