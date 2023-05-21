const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Una compañia debe de tener un nombre"],
        maxlength: [200,"El nombre de la compañia debe de tener como maximo 200 caracteres"],
        trim: true
    },
    legalRepresentative:{
        name:{
            type: String,
            required: [true,"El representante legal debe de tener un nombre"],
            maxlength: [200,"El nombre del represante legal debe de tener como maximo 200 caracteres"],
            trim: true
        },
        lastName:{
            type: String,
            required: [true,"El representante legal debe de tener un apellido paterno"],
            maxlength: [200,"El apellido paterno del represante legal debe de tener como maximo 200 caracteres"],
            trim: true
        },
        motherLastName:{
            type: String,
            required: [true,"El representante legal debe de tener un apellido materno"],
            maxlength: [200,"El apellido materno del represante legal debe de tener como maximo 200 caracteres"],
            trim: true
        },
    },
    logo:{
        url:{
            type: String
        },
        key:{
            type: String
        }
    },
    seal:{
        url:{
            type: String
        },
        key:{
            type: String
        }
    },
    user:{
        type: String
    },
    
});

const Company = mongoose.model("Company",companySchema);

module.exports = Company;