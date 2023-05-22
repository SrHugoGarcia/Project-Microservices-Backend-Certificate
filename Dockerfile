# Base image for ARM64
FROM arm64v8/ubuntu:20.04

RUN mkdir -p /usr/local/bin
# Instalar dependencias necesarias
RUN apt-get update && \
     apt-get install apt-transport-https ca-certificates curl gnupg lsb-release


# Instalar Docker
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
        sudo apt-get update && \ sudo apt-get install docker-ce docker-ce-cli containerd.io


# Crear directorio de la aplicación
RUN mkdir -p /app

# Copiar archivos de configuración
COPY ./API_Gateway /app/API_Gateway/
COPY ./API_User /app/API_User/
COPY ./API_Course /app/API_Course/
COPY ./API_Payment /app/API_Payment/
COPY ./API_Certificate /app/API_Certificate/
COPY ./API_Company /app/API_Company/
COPY ./API_Plan /app/API_Plan/
COPY ./Data /app/Data/
COPY ./Scripts_DBS /app/Scripts_DBS/

# Configuración de los servicios

# Comando de inicio
CMD ["docker-compose", "up"]
