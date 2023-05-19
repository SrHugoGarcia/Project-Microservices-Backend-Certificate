const mongoose = require('mongoose');

const conexionDB =async ()=>{
    /*useNewUrlParser, useUnifiedTopology, useFindAndModifyy useCreateIndex ya no son opciones 
    compatibles. Mongoose 6 siempre se comporta como si useNewUrlParser, useUnifiedTopologyy 
    useCreateIndexfueran truey useFindAndModifyes false.*/
    //const db = process.env.DATABASE_LOCAL.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
    const db = process.env.DATABASE_LOCAL;
    //Parametros(conexionDataBase,{configuracion})).La promesa(nos regresa algo)
    await  mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con=>{
        // console.log(con.connections)
        console.log("Conexion con la base de datos exitosa");
    })
   
}


module.exports = conexionDB;