const express = require('express');
const morgan = require('morgan');
const erroresGlobales = require('../controllers/errorController');

const courseRouter = require("../routes/courseRouter");

const app = express();

if(process.env.NODE_ENV === 'development'){
    //nos da la informacion de la solicitud en consola
    app.use(morgan('dev'));
}

app.use(express.json({limit: '10kb'}));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use("/api/v1/course",courseRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`No se encuentra ${req.originalUrl} en este servidor`,404))
})

//MANEJO DE ERRORES A NIVEL GLOBAL
app.use(erroresGlobales);

module.exports = app;