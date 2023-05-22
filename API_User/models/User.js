const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const countries = require('../utils/typeCountry');
const roles = require('../utils/typeRole');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        maxlength: [200,"El nombre del usuario debe de tener como maximo 200 caracteres"],
        required: [true,"Un usuario debe de tener un nombre"],
    },
    lastName:{
        type: String,
        maxlength: [200,"El apellido paterno del usuario debe de tener como maximo 200 caracteres"],
        required: [true,"Un usuario debe de tener un apellido paterno"],
    },
    motherLastName:{
        type: String,
        maxlength: [200,"El apellido materno del usuario debe de tener como maximo 200 caracteres"],
        required: [true,"Un usuario debe de tener un apellido materno"],
    },
    phone:{
        type: String,
        minlength: [10, "El celular del usuario debe tener exactamente 10 caracteres"],
        maxlength: [10, "El celular del usuario debe tener exactamente 10 caracteres"],
        required: [true, "Un usuario debe tener un número de celular"],
    },      
    country:{
        type: String,
        maxlength: [200,"El pais debe de tener como maximo 200 caracteres"],
        required: [true,"Un usuario debe de tener un pais"],
        enum: countries,
    },
    email:{
        type: String,
        required: [true,"Un usuario debe de tener un correo"],
        unique:[true]
    },
    password:{
        type: String,
        required: [true,"Un usuario debe de tener una contraseña"],
        minlength: [8,"Una contraseña debe de tener como minimo 8 caracteres"],
        maxlength: [64,"Una contraseña debe de tener como maximo 64 caracteres"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true,"Porfavor confirma tu contraseña"],
        //Solo sirve para save o create esta validacion
        validate: {
            validator: function(val){
                return val === this.password;
            },
        message: "Las constraseñas no coinciden"
        }
    },
    role:{
        type: String,
        trim: true,
        default: "admin",
        enum: roles,
    },
    active:{
        type: Boolean
    },
    token:String,
})

//Hashando contraseña antes de que se guarde

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmarPassword = undefined;
    next();
})

userSchema.pre('save',function(next){
    this.token = Date.now().toString(32) + Math.random().toString(32).substring(2);
    next();
})


//Comparar contraseñas cunado se login user

userSchema.methods.correctaContraseña =async function(candidatoContraseña, userContraseña){
    return await bcrypt.compare(candidatoContraseña,userContraseña);
}

const User = mongoose.model("User",userSchema);
module.exports = User;