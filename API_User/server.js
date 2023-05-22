//Manejo de Excepciones no detectadas (Todos lo errores o también llamados bugs)
//SOLO CODIGO SYNCRONO
process.on('uncaughtException', err =>{
    console.log(err.name, err.message)
    console.log("UNHANDLE REJECTION SERVIDOR CERRADO....")
    process.exit(1)

})

//Para agregar las variables de entorno a Node
const dotenv = require('dotenv');
dotenv.config({path: "./config.env"})

const app = require('./config/app');
const conexionDB = require('./config/db');

//Conexion con nuestra base de datos
conexionDB();
 
//Creamos nuestra variable del puerto
const port = process.env.PORT || 3000;

//Creando nuestro servidor
const server = app.listen(port,()=>{
    console.log(`Ejecutando servidor en el puerto ${port}...`);
})

//Manejo de promesas rechazadas y es para todo nuestro codigo asyncrono
process.on("unhandledRejection",err=>{
    console.log(err.name,err.message)
    //Codigo 0 = exito
    //codigo 1 = excepcion no detectada
    console.log("UNHANDLE REJECTION SERVIDOR CERRADO....")
    //Con el server.close permitimos que se espere a que complete las peticiones pendientes y despues lo cierre
    server.close(()=>{
        process.exit(1)
    })
})
