const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = require('./config/app');

const port = process.env.PORT || 3005;

app.listen(port,()=>{
    console.log("Ejecutando en el puerto " + port);
});