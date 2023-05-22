FROM node:18.12.1

RUN mkdir -p /usr/src/company

WORKDIR /usr/src/company

COPY package.json ./

COPY package-lock.json ./

COPY config.env ./

RUN npm install

COPY . .

CMD ["sh", "-c", "sleep 10 && npm run production"]
