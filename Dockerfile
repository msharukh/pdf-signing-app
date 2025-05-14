# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose port 8080 to access the app
EXPOSE 8080

# Run the app
CMD ["node", "index.js"]
