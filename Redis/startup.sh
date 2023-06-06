#!/bin/bash

# Espera a que el contenedor de Redis se inicie completamente
sleep 10

# Llama a la API para obtener los datos iniciales
curl http://<API_URL>/obtener-datos-iniciales
/*
    cron.schedule('*/10 * * * *', async () => {
    let client;
  
    try {
      // Llama a la API para obtener los datos actualizados
      const users = await User.find();
      // Almacena los datos en Redis
      console.log("Obtener datosssss");
  
      client = redis.createClient({
        host: 'redis',
        port: process.env.PORT_REDIS
      });

      await client.set('users', JSON.stringify(users));
  
      const getDataFromRedis = () => {
        return new Promise((resolve, reject) => {
          client.get('users', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      };
  
      const redisData = await getDataFromRedis();
  
      if (redisData) {
        const parsedData = JSON.parse(redisData);
        // Hacer algo con los datos de usuarios obtenidos desde Redis
        console.log('Usuarios:', parsedData);
      } else {
        // Los datos no están en Redis, debes obtenerlos desde la base de datos MongoDB
        console.log('No se encontraron datos en Redis. Obtén los datos desde la base de datos MongoDB.');
      }
    } catch (err) {
      console.error('Error al obtener los datos actualizados:', err);
    } finally {
      if (client) {
        //client.quit();
      }
    }
  });*/

    redis:
    image: redis
    restart: always
    networks:
      - red-local
    #volumes:
      #- ./Redis/startup.sh:/docker-entrypoint-initdb.d/startup.sh
    #command: ["sh", "/docker-entrypoint-initdb.d/startup.sh"]
  