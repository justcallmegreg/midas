# Backend Service - Dockerfile
# This Dockerfile defines the container image for the Flask backend service.
# It will be configured with the application implementation.

FROM python:3.10-slim

# Metadata
LABEL maintainer="Gergo Nagy"
LABEL description="Midas Backend Service"

# Set working directory
WORKDIR /app

# Copy dependency files
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/healthz || exit 1

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "wsgi:app"]
