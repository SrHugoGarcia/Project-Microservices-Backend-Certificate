const Course = require('../models/Course');
const axios = require('axios');
const {deleteOne, updateOne, getOne, getAll, createOne} = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { API_USER_EMAIL_ADMIN, API_USER_PASSWORD_ADMIN, APIGATEWAY,FRONTEND_URL2 } = process.env;

const serverAxios = axios.create({
    baseURL: APIGATEWAY,
  });

const createCourse=createOne(Course);

const allCourses = getAll(Course);

const oneCourse = getOne(Course);

const updateCourse = updateOne(Course);

const deleteCourse = deleteOne(Course);

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
        headers: {
          Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
        },
      });
      const response = await serverAxios({
        method: "GET",
        url: `/user/${req.body.user}`,
        withCredentials: true,
        headers: {
            'Cookie': data.data.token,
            Origin: FRONTEND_URL2 // Reemplaza con el dominio del cliente
          }
      });
      const role = response.data.data.data.role;
      if(!(role === "admin")){
        return next(new AppError("No tienes los permisos necesarios",401));
      }
    next();
})

module.exports = {createCourse, oneCourse,allCourses,deleteCourse,updateCourse, verifyUserExists };