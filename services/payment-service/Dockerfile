FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create the logs directory for storing logs
RUN mkdir -p /app/logs

EXPOSE 8006

CMD ["npm", "run", "dev"]
