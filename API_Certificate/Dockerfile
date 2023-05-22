FROM node:18.12.1

RUN mkdir -p /usr/src/certificate

WORKDIR /usr/src/certificate

COPY package.json ./

COPY package-lock.json ./

COPY config.env ./

RUN npm install

COPY . .

CMD ["sh", "-c", "sleep 10 && npm run production"]
