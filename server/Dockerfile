# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose the port that the application runs on
EXPOSE 5001

# Use the environment variable PORT (required for Dokku)
CMD ["sh", "-c", "PORT=${PORT:-5001} node server.js"]