const Payment = require('../models/Payment');
const axios = require('axios');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('../controllers/handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN, APIGATEWAY } = process.env;

const serverAxios = axios.create({
    baseURL: APIGATEWAY,
  });

const createPayment=createOne(Payment);

const allPayments = getAll(Payment);

const onePayment = getOne(Payment);

const updatePayment = updateOne(Payment);

const deletePayment = deleteOne(Payment);

const verifyUserExists = catchAsync(async(req,res,next)=>{
    if(!API_USER_EMAIL_ADMIN && API_USER_PASSWORD_ADMIN) return next(new AppError("Falta la configuracion de las cuentas del administrador",404));
    const data = await serverAxios({
        method: "POST",
        url: `/user/login`,
        data: {
            email: API_USER_EMAIL_ADMIN,
            password: API_USER_PASSWORD_ADMIN,
        },
        withCredentials: true,
      });
      const response = await serverAxios({
        method: "GET",
        url: `/user/${req.body.user}`,
        withCredentials: true,
        headers: {
            'Cookie': data.data.token
          }
      });
      const role = response.data.data.data.role;
      if(!(role === "admin")){
        return next(new AppError("No tienes los permisos necesarios",401));
      }
    next();
});
const assignPlan = catchAsync(async(req,res,next)=>{
  const data = await serverAxios({
      method: "GET",
      url: `/plan?id=${req.body.plan}`,
      withCredentials: true,
    });
    if(data.data.data[0]){
        req.body.plan = data.data.data[0].id
    }else{
      return next(new AppError("Hay un error con tu cuenta contacta a soporte",401))
    }
    //req.body.payment = data.data.data[0].id
   next();
});

module.exports = {createPayment, onePayment,allPayments,deletePayment,updatePayment, verifyUserExists,assignPlan };