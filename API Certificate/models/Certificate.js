const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    invoice:{
        type: String,
        required: [true,"Una certificado debe de tener un folio"],
        trim: true
    },
    studentName:{
        type: String,
        required: [true,"Una certificado debe de tener un nombre del estudiante"],
        maxlength: [200,"El nombre del estudiante debe de tener como maximo 200 caracteres"],
        trim: true
    },
    finalScore:{
        type: String,
        required: [true,"Una certificado debe de tener una calificacion final"],
        maxlength: [200,"La calificacion final debe de tener como maximo 200 caracteres"],
        trim: true
    },
    dateIssue:{
        type: Date,
        required: [true,"Una certificado debe de tener una fecha de emision"],
    },
    url:{
        url:{
            type: String
        },
        key:{
            type: String
        }
    },
    user:{
        type: String,
        required: [true, "Un certificado necesita un usuario"]
    },
    course:{
        type: String,
        required: [true, "Un certificado necesita un curso"]
    },
    company:{
        type: String,
        required: [true, "Un certificado necesita una compañia"]
    },
    payment:{
        type: String,
        required: [true, "Un certificado necesita un payment"]
    },
});

const Certificate = mongoose.model("Company",certificateSchema);

module.exports = Certificate;
