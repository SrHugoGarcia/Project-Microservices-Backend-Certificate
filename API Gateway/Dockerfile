FROM node:18.12.1

RUN mkdir -p /usr/src/gateway

WORKDIR /usr/src/gateway

COPY package.json ./

COPY package-lock.json ./

COPY config.env ./

RUN npm install

COPY . .

CMD ["npm","run","dev"]