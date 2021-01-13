FROM node:14

WORKDIR /usr/src/tagbot_bot

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "bot.js" ]

