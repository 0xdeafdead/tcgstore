FROM node:20-alpine3.18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

EXPOSE 3000

COPY . . 

RUN npx nx run base-api:build:production

CMD ["node", "dist/main.js"]