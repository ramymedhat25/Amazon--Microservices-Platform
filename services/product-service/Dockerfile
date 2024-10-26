# Use the official Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8001 for the Product Service
EXPOSE 8001

# Start the service
CMD ["npm", "start"]