const Payment = require('../models/Payment');
const axios = require('axios');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('../controllers/handleFactory');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN } = process.env;

const serverAxios = axios.create({
    baseURL: `http://127.0.0.1:3000`,
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
})

module.exports = {createPayment, onePayment,allPayments,deletePayment,updatePayment, verifyUserExists };