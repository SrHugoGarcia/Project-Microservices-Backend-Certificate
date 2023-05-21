const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = require('./config/app');

const conexionDB = require('./config/db');

const port = process.env.PORT || 3006;

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