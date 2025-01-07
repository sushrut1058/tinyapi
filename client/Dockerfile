FROM node:20

WORKDIR /client
RUN npm install serve

COPY package*.json .
RUN npm install
COPY . .

RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist"]
