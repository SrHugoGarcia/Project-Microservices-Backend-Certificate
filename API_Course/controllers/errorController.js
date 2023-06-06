const AppError = require("../utils/AppError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProduccion = (err, res) => {
  if (err.isOperacional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Algo salió muy mal'
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Inválido ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Ya existe: ${err.errors[0]}. Por favor, use otro valor.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errores = err.errors.map((el) => el.path + (el.value?(" esta " + el.value):""));
  const message = `Datos de entrada inválidos: ${errores}`;
  return new AppError(message, 400);
};

const handleValidationTotalDeCamposDB = (err) => {
  const message = "Los campos están incompletos. Por favor, envíe los datos completos.";
  return new AppError(message, err.status);
};

const handleErrorServerUser = (err)=>{
  //console.log(err.response.data.error.value)
  if(err.response.data.message){
    return new AppError("La API-User dice: " + err.response.data.message,400)
  }else if(err.response.data.error){
    return new AppError("La API-User dice: " + err.response.data.error,500)
  }
  return new AppError("La API-User dice: error",500)
}

const erroresGlobales = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //console.log("Inicia")
  console.log(err)
  //console.log("Termina")
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "SequelizeUniqueConstraintError") error = handleDuplicateFieldsDB(error);
    if (error.name === "SequelizeValidationError") error = handleValidationErrorDB(error);
    if (error.name === "SequelizeDatabaseError") error = handleValidationTotalDeCamposDB(error);
    if (error.statusCode === 500 ) error = handleErrorServerUser(error);

    sendErrorProduccion(error, res);
  }
};

module.exports = erroresGlobales;
