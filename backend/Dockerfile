FROM node:18-alpine

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Run the Express server
CMD ["node", "src/index.js"]
