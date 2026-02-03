FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g http-server

COPY --from=build /app/dist/hrms-lite ./dist

EXPOSE 4200

CMD ["http-server", "dist", "-p", "4200", "--proxy", "http://localhost:8000?"]
