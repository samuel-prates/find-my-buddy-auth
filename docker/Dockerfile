# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables with default values
ENV NODE_ENV=production \
    DB_HOST=postgres \
    DB_PORT=5432 \
    DB_USERNAME=postgres \
    DB_PASSWORD=postgres \
    DB_DATABASE=find_my_buddy

# Command to run the application
CMD ["node", "dist/main"]