FROM node:12-alpine

WORKDIR /usr/app

RUN npm install && \
    npm install -g truffle

COPY . .