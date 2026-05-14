# Use an official Node.js runtime as a parent image
# Alpine is used for a much smaller, lightweight image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
# Using npm ci is generally safer in CI/CD, but install is fine here
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose port 5000 to the outside once the container has launched
EXPOSE 5000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
