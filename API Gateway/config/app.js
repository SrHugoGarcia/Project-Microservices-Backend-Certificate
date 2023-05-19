const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const { APIUSER, APICOURSE, APIPAYMENT, APICERTIFICATE,APICOMPANY, APIPLAN } = process.env;

const handleErrors =(err,req,res,next)=>{
    res.status(500).json({
        error: "Error en el server",
        stack: err
    });
};

app.use('/user', createProxyMiddleware({target: APIUSER,changeOrigin: true, onError: handleErrors}));
app.use('/course', createProxyMiddleware({target: APICOURSE,changeOrigin: true, onError: handleErrors}));
app.use('/payment', createProxyMiddleware({target: APIPAYMENT,changeOrigin: true, onError: handleErrors}));
app.use('/certificate', createProxyMiddleware({target: APICERTIFICATE,changeOrigin: true, onError: handleErrors}));
app.use('/company', createProxyMiddleware({target: APICOMPANY,changeOrigin: true, onError: handleErrors}));
app.use('/plan', createProxyMiddleware({target: APIPLAN,changeOrigin: true, onError: handleErrors}));

module.exports = app;