FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY migrate.js ./

CMD ["npm", "run", "migrate"]
