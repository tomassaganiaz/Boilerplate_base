FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm install -g npm-check-updates

EXPOSE 3000

CMD ["node", "src/index.js"]
