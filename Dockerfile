# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (this creates fresh Linux binaries)
RUN npm ci

# Copy the rest of the source code
# .dockerignore should prevent local node_modules from overwriting the fresh install
COPY . .

# CRITICAL: Fix for Windows line ending issues in scripts
# This ensures that even if node_modules were partially copied, they work on Linux.
RUN find node_modules/.bin/ -type l -or -type f -exec sed -i 's/\r$//' {} +

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
