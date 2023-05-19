const User = require('../models/User');
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/CatchAsync');

const signToken = id =>{
    return jwt.sign({id: id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE_IN
    });
}

const createSendToken =(user,statusCode,req,res)=>{
    const token = signToken(user._id);
    //Las cookies sirven para que el navegador no pueda modicar ni acceder a la cookie que mandaremos
    //Un cookie es un pequeño fragmento de texto
    const cookieOptions ={
        //Fecha en milisegundos
        secure: true,
        //secure:  req.secure || req.headers['x-forwarded-proto'] === 'https',
        expires: new Date (
        Date.now () + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        sameSite: 'none',
    }
    user.password = undefined;
    res.cookie('jwt',token,cookieOptions);
    /*res.cookie('checkToken', true, {
        secure:  req.secure || req.headers['x-forwarded-proto'] === 'https', 
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 *60 *60*1000),
      }) */

    //console.log(res)
    res.status(statusCode).json({
        status: "successful",
        token,
        data: {
            user,
            checkToken: true
        }
    })
}


const register = catchAsync(async(req,res,next)=>{   
    const newUser= await User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        motherLastName: req.body.motherLastName,
        country: req.body.country,
        phone: req.body.phone,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
    });
    createSendToken(newUser,201,req,res);
});

const login =catchAsync(async(req,res,next)=>{
    const {email, password}= req.body;
    //1) verificar si existe email y la contraseña
    if(!email || !password){
        return next(new AppError("Porfavor ingrese una email y contraseña",400))
    }
    //2)Verificar si el correo y la contraseña son correctos
    const usuario = await User.findOne({email}).select(' -__v +password');
    if(!usuario || !await usuario.correctaContraseña(password, usuario.password)){
        return next(new AppError("Incorrecta email o password",401))
    }
   
    const user = await User.findOne({email})
    //Enviar un JWT al cliente
    createSendToken(user,200,req,res);
})

const signOff =(req,res)=>{
    res.cookie('jwt', 'signOff',{
        expires: new Date(Date.now() +10 * 1000),
        secure: true,
        sameSite: 'none',
    });
    res.status(200).json({status: 'successful'});
};

//Protejemos nuestras rutas, verificando si la persona es un usuario
const protect =catchAsync(async(req,res,next)=>{
    let token;
    //1)Traer el token y verificar si existe
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }else if(req.cookies.jwt){
            token = req.cookies.jwt;
        }
    if(!token) return next(new AppError("Tu no has iniciado sesion, porfavor inicia sesion para obtener el acceso",401));
    //2) Verificar si el token es valido
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //3) Verificar si el usuario existe
    const user = await User.findById(decoded.id)
    if(!user) return next(new AppError("el usuario que pertenece a este token ya no existe",404));
    //ACCESO A LA RUTA
    req.user = user;
    next();
})

//Restringir acceso
const restrictTo =(...roles)=>{
    return (req,res,next)=>{
        //roles ["admin", "lead-guide"]
        if(!roles.includes(req.user.role)){
            return next(new AppError("No tienes los permisos para realizar esta accion",403))
        }
        next();
    }
}

//Actualizar contraseña sin que la halla olvidado esta funcion puede estar cuando se loge
const updatePassword = catchAsync(async(req,res,next)=>{
    //Como seguridad siempre que el usuario quiera cambiar la contraseña debemos de pedirsela
    //1)Obtener el usuario de la collection
    const user = await User.findById(req.user.id).select('+password');
    //2)Verificar si la contraseña publicada es correcta
    const passwordCurrent = req.body.passwordCurrent;
    if(!await user.correctaContraseña(passwordCurrent,user.password)){
        return next(new AppError("Las contraseña es incorrecta",401));
    }
    //3)Actualizar el password
    const password= req.body.password;
    const confirmPassword = req.body.confirmPassword;
    user.password = password
    user.confirmPassword = confirmPassword;
    await user.save();
    //4) Volver a iniciar sesion y enviar el JWT
    createSendToken(user,200,req,res);
    
});
module.exports = {signOff, login,register ,protect, restrictTo, updatePassword };