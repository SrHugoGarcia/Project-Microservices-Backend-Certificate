const Plan = require('../models/Plan');
const axios = require('axios');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('./handleFactory');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN, APIGATEWAY } = process.env;

const serverAxios = axios.create({
    baseURL: APIGATEWAY,
  });

const createPlan=createOne(Plan);

const allPlans = getAll(Plan);

const onePlan = getOne(Plan);

const updatePlan = updateOne(Plan);

const deletePlan = deleteOne(Plan);

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

module.exports = {createPlan, onePlan,allPlans,deletePlan,updatePlan, verifyUserExists };