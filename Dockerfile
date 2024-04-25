#Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn build

ARG NODE_ENV=production

#Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json .

RUN yarn install --frozen-lockfile

COPY --from=build /app/build build

CMD yarn prod