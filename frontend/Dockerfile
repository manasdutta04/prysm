# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all code
COPY . .

# Set VITE_API_URL argument (defaults to /api for proxying)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the production React bundle
RUN npm run build

# Serve stage using Nginx
FROM nginx:alpine

# Copy built frontend assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
