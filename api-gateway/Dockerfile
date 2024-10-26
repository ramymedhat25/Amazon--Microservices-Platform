FROM node:16
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately for better caching
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the service will run on
EXPOSE 8000

# Start the service
CMD ["npm", "start"]
