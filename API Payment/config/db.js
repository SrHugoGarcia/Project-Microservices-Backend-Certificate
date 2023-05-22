const { Sequelize } = require('sequelize');
const { HOST_DB, PORT_DB, NAME_DB, USER_DB,PASSWORD_DB } = process.env;
  const conexionDB = new Sequelize(NAME_DB, USER_DB, PASSWORD_DB, {
    host: HOST_DB, // aquí debes proporcionar la dirección IP o el nombre de host del servidor
    port: PORT_DB, // aquí debes proporcionar el número de puerto de la base de datos
    dialect: 'mariadb',
    logging: false, // opcional, para desactivar los registros en la consola
  });

module.exports = conexionDB;