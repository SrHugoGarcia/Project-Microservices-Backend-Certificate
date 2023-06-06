const Company = require('../models/Company');
const axios = require('axios');
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('./handleFactory')
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN, APIGATEWAY,FRONTEND_URL2 } = process.env;

const serverAxios = axios.create({
    baseURL: APIGATEWAY,
  });

const createCompany=createOne(Company);

const allCompanys = getAll(Company);

const oneCompany = getOne(Company);

const updateCompany = updateOne(Company);

const verifyUserExists = catchAsync(async(req,res,next)=>{
  console.log("inicio")
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
      console.log("intermedio")
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
      console.log("Fin")
    next();
});

const deleteCompany = deleteOne(Company);

module.exports = { createCompany, oneCompany,allCompanys,deleteCompany,updateCompany,verifyUserExists };