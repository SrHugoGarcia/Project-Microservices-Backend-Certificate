const express = require('express');
const morgan = require('morgan');
const certificateRouter = require('../routes/certificateRouter');
const app = express();

if(process.env.NODE_ENV === 'development'){
    //nos da la informacion de la solicitud en consola
    app.use(morgan('dev'));
}

app.use(express.json({limit: '10kb'}));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/certificate',certificateRouter);

module.exports = app;