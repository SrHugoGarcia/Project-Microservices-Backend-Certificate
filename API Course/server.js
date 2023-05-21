process.on('uncaughtException', err =>{
  console.log(err.name, err.message)
  console.log("UNHANDLE REJECTION SERVIDOR CERRADO....")
  process.exit(1)

})

const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = require("./config/app");

const conexionDB = require('./config/db');

const port = process.env.PORT || 3003;

(async () => {
    try {
      await conexionDB.authenticate();
      console.log('Conexión con la base de datos exitosa');
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
    }
  })();
app.listen(port,()=>{
    console.log("Ejecutando en el puerto " + port);
});

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