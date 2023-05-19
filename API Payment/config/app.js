const express = require('express');
const morgan = require('morgan');

const paymentRouter = require('../routes/paymentRouter');
const app = express();

if(process.env.NODE_ENV === 'development'){
    //nos da la informacion de la solicitud en consola
    app.use(morgan('dev'));
}

app.use(express.json({limit: '10kb'}));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/payment',paymentRouter);

module.exports = app;