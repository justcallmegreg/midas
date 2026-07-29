# Backend Service

> Python Flask REST API with SQLAlchemy ORM integration.

## Overview

The backend is a stateless HTTP service that provides RESTful APIs for the data intelligence platform. It uses SQLAlchemy for database abstraction, supporting multiple database backends with SQLite as the default.

## Technology Stack

- **Framework:** Flask
- **ORM:** SQLAlchemy
- **Database:** SQLite (default), configurable to PostgreSQL, MySQL, etc.
- **ASGI Server:** Gunicorn (production)
- **Python:** 3.10+

## Getting Started

### Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables (optional)
export DATABASE_URL=sqlite:///app.db
export FLASK_ENV=development

# Run development server
python app.py
```

### Docker

```bash
# Build image
docker build -t midas-backend .

# Run container
docker run -p 5000:5000 midas-backend
```

## Configuration

The application is configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./app.db` | Database connection URL |
| `FLASK_ENV` | `development` | Flask environment (development/production) |
| `DB_POOL_SIZE` | `5` | SQLAlchemy connection pool size |
| `DB_MAX_OVERFLOW` | `10` | SQLAlchemy pool overflow connections |
| `LOG_LEVEL` | `INFO` | Application log level |

### Database URL Examples

```bash
# SQLite (default)
DATABASE_URL=sqlite:///./app.db

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/midas

# MySQL
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/midas
```

## API Endpoints

### Health Check

```
GET /healthz
```

Returns `200 OK` with health status if the service and database are operational.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Database Connection Best Practices

### Connection Pooling

- **Pool Size:** Set based on expected concurrent requests
- **Max Overflow:** Additional connections allowed under high load
- **Pool Pre-Ping:** Verifies connection before use (handles stale connections)
- **Pool Recycle:** Connections recycled periodically (handles database timeouts)

### Stateless Design

- Each request gets its own database session
- Sessions are automatically cleaned up after request completion
- No global session state is maintained
- Compatible with horizontal scaling

## Project Structure

```
backend/
├── app/
│   ├── __init__.py              # Application factory
│   ├── config.py                # Configuration management
│   ├── database.py              # SQLAlchemy initialization
│   ├── models.py                # Data models
│   └── routes/
│       ├── __init__.py
│       └── health.py            # Health check endpoint
├── tests/
│   ├── conftest.py              # Test configuration
│   ├── test_health.py           # Health endpoint tests
│   └── test_database.py         # Database connection tests
├── Dockerfile                   # Container definition
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── wsgi.py                      # WSGI entry point
└── README.md                    # This file
```

## Testing

```bash
# Run all tests
make test-backend

# Run specific test file
pytest tests/test_health.py -v

# Run with coverage
pytest --cov=app tests/
```

## Deployment

### Docker Compose

Use the root `docker-compose.yml` to run the backend with other services:

```bash
docker-compose up backend
```

### Kubernetes

For Kubernetes deployment, see deployment manifests in the infrastructure directory.

## Troubleshooting

### Database Connection Errors

1. Verify `DATABASE_URL` environment variable is set correctly
2. Check database credentials
3. Ensure database server is running and accessible
4. Review logs: `docker logs midas-backend`

### Health Check Failing

1. Verify `/healthz` endpoint is responding: `curl http://localhost:5000/healthz`
2. Check database connectivity separately
3. Review application logs for specific errors

## Maintenance

### Updating Dependencies

```bash
# Update requirements.txt
pip install -U -r requirements.txt
pip freeze > requirements.txt
```

### Database Migrations

When adding new models, ensure `db.create_all()` is called during application initialization.

---

**Version:** See [VERSION.txt](../VERSION.txt)

**License:** See [COMMERCIAL_LICENSE.md](../COMMERCIAL_LICENSE.md)
