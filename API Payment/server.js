const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = require('./config/app.js');

const port = process.env.PORT || 3003;

app.listen(port,()=>{
    console.log("Ejecutando en el el puerto 3003");
});