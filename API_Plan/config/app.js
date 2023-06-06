const express = require('express');
const morgan = require('morgan');
const erroresGlobales = require('../controllers/errorController');
const AppError = require('../utils/AppError')
const cors = require('cors');
const planRouter = require('../routes/planRouter');

const app = express();

if(process.env.NODE_ENV === 'development'){
    //nos da la informacion de la solicitud en consola
    app.use(morgan('dev'));
}

app.use(express.json({limit: '10kb'}));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));


const whileList = [process.env.FRONTEND_URL,process.env.FRONTEND_URL2];
const corsOptions = {
    origin: function (origin, callback) {
      if(whileList.includes(origin)){
        callback(null,true)
      }else{
        callback(new AppError("No tienes el acceso a la api",401))
      }
    },    
    credentials: true
  }

app.use(cors(corsOptions))

app.use("/api/v1/plan",planRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`No se encuentra ${req.originalUrl} en este servidor`,404))
})

//MANEJO DE ERRORES A NIVEL GLOBAL
app.use(erroresGlobales);

module.exports= app;