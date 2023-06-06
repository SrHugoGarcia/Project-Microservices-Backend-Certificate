const Certificate = require('../models/Certificate');
const axios = require('axios');
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('./handleFactory')
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN, APIGATEWAY,FRONTEND_URL2 } = process.env;

const serverAxios = axios.create({
    baseURL: APIGATEWAY,
  });

const createCertificate=createOne(Certificate);

const allCertificates = getAll(Certificate);

const oneCertificate = getOne(Certificate);

const updateCertificate = updateOne(Certificate);

const verifyUserExists = catchAsync(async(req,res,next)=>{
    if(!API_USER_EMAIL_ADMIN && API_USER_PASSWORD_ADMIN) return next(new AppError("Falta la configuracion de las cuentas del administrador",404));
    const data = await serverAxios({
        method: "POST",
        url: `/user/login`,
        data: {
            email: API_USER_EMAIL_ADMIN,
            password: API_USER_PASSWORD_ADMIN,
        },
        headers: {
          Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
        },
        withCredentials: true,
      });
      if(!req.body.user)return next(new AppError("No tienes los permisos no te has logeado",404))
      const response = await serverAxios({
        method: "GET",
        url: `/user/${req.body.user}`,
        withCredentials: true,
        headers: {
            'Cookie': data.data.token,
            Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
          }
      });
    next();
});

const verifyCurseExists = catchAsync(async(req,res,next)=>{
    if(!req.body.course)return next(new AppError("Debes de seleccionar un curso",404))
    const response = await serverAxios({
      method: "GET",
      url: `/course?id=${req.body.course}`,
      withCredentials: true,
      headers: {
        Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
      },
    });
    if(response.data.data[0]){
      req.body.course = response.data.data[0].id
    }else{
      return next(new AppError("El curso no existe selecciona uno valido",401))
    }
  next();
});

const verifyCompanyExists = catchAsync(async(req,res,next)=>{
  if(!req.body.company)return next(new AppError("Debes de seleccionar una compañia",404))
  const response = await serverAxios({
    method: "GET",
    url: `/company?_id=${req.body.company}`,
    withCredentials: true,
    headers: {
      Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
    },
  });
  if(response.data.data.data[0]){
    req.body.company = response.data.data.data[0]._id
  }else{
    return next(new AppError("La company no existe selecciona uno valido",401))
  }
  next();
});

const assignPayment = catchAsync(async(req,res,next)=>{
  if(!API_USER_EMAIL_ADMIN && API_USER_PASSWORD_ADMIN) return next(new AppError("Falta la configuracion de las cuentas del administrador",404));
  const data = await serverAxios({
      method: "GET",
      url: `/payment?user=${req.body.user}&active=true`,
      withCredentials: true,
      headers: {
        Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
      },
    });
    if(data.data.data[0]){
        req.body.payment = data.data.data[0].id
    }else{
      return next(new AppError("No cuentas con un plan.",401))
    }
    //req.body.payment = data.data.data[0].id
   next();
});

const generateInvoice = catchAsync(async(req,res,next)=>{
    req.body.invoice = generarRandom(9)
    next();
})

function generarRandom(num) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let resultado = "";
    let ch;
    while (resultado.length < num){
        ch = characters.charAt(Math.floor(Math.random() * charactersLength));
        if (!resultado.includes(ch)){
            resultado += ch;
        }
    }
    return resultado;
}

const deleteCertificate = deleteOne(Certificate);

module.exports = { createCertificate, oneCertificate,allCertificates,deleteCertificate,updateCertificate,
  verifyUserExists,assignPayment,verifyCurseExists,verifyCompanyExists,generateInvoice };