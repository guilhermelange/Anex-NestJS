FROM node@sha256:28bed508446db2ee028d08e76fb47b935defa26a84986ca050d2596ea67fd506

RUN apk add --no-cache bash

RUN npm i -g @nestjs/cli@7.4.1

USER node

WORKDIR /home/node/app