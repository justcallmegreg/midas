# Frontend Service - Dockerfile
# This Dockerfile defines the container image for the frontend service.
# It will be configured with the application implementation.

FROM node:18-alpine

# Metadata
LABEL maintainer="Gergo Nagy"
LABEL description="Midas Frontend Service"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]
