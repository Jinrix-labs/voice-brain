# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start serving the built app
CMD ["serve", "-s", "dist", "-l", "3000"]

