const Plan = require('../models/Plan');
const axios = require('axios');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN, APIGATEWAY,FRONTEND_URL2 } = process.env;

const serverAxios = axios.create({
    baseURL: APIGATEWAY,
  });

const createPlan=createOne(Plan);

const allPlans = getAll(Plan);

const onePlan = getOne(Plan);

const updatePlan = updateOne(Plan);

const deletePlan = deleteOne(Plan);

const authenticateAdmin = catchAsync(async (req, res, next) => {
  if (!API_USER_EMAIL_ADMIN || !API_USER_PASSWORD_ADMIN) {
    return next(new AppError("Falta la configuracion de las cuentas del administrador", 404));
}

const loginResponse = await serverAxios({
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

  if (!loginResponse.data.token) {
    return next(new AppError("Error de autenticación del administrador", 401));
  }

  req.adminToken = loginResponse.data.token;
  next();
});

const verifyUserExists = catchAsync(async (req, res, next) => {
  console.log(req.body.user)
  const userResponse = await serverAxios({
    method: "GET",
    url: `/user/${req.body.user}`,
    withCredentials: true,
    headers: {
      'Cookie': req.adminToken,
      Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
    },
  });
  console.log("errr")
  console.log(userResponse.data.data.data.role)
  const role = userResponse.data.data.data.role;
  if (!(role === "admin")) {
    return next(new AppError("No tienes los permisos necesarios", 401));
  }

  next();
});


module.exports = {createPlan, onePlan,allPlans,deletePlan,updatePlan, verifyUserExists, authenticateAdmin };