FROM node:18-alpine

RUN apk add --no-cache git
WORKDIR /app
COPY . .

RUN npm install

RUN git submodule update --init --recursive
RUN cd ./AutoWebPerf && npm install


CMD ["node", "./index.js"]