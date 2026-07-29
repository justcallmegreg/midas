# Backend

Flask-based stateless web service backend for the Akkerman project.

**Version:** 0.1.0

## Overview

This is a production-ready Flask web service with:
- SQLAlchemy ORM for database connectivity
- Configurable database (SQLite default, supports PostgreSQL/MySQL)
- Connection pooling with best practices
- Health check endpoint (`/healthz`)
- Comprehensive test coverage
- Docker containerization ready

## Architecture

```
backend/
├── app.py                  # Flask application factory
├── config.py              # Environment configuration
├── database.py            # SQLAlchemy engine & pooling setup
├── models.py              # ORM models
├── routes/
│   └── health.py         # Health check endpoint
├── tests/
│   ├── conftest.py       # Test fixtures
│   ├── test_health.py    # Health endpoint tests
│   └── test_database.py  # Database connectivity tests
└── data/
    └── akkerman.db       # SQLite database (created on first run)
```

## Quick Start

### Local Development

```bash
# Install dependencies
make install-dev

# Run backend
make run-backend

# In another terminal, test health endpoint
curl http://localhost:5000/healthz
```

**Expected response:**
```json
{
  "status": "healthy"
}
```

### Running Tests

```bash
# All tests
make test

# Health endpoint only
make test-health

# Database connectivity
make test-db
```

## Environment Configuration

The backend uses environment variables for configuration. See [config.py](./config.py) for all available options.

### Database Configuration

Set `DATABASE_URL` to use a different database:

```bash
# SQLite (default)
export DATABASE_URL="sqlite:///./data/akkerman.db"

# PostgreSQL
export DATABASE_URL="postgresql://user:pass@localhost:5432/akkerman"

# MySQL
export DATABASE_URL="mysql+pymysql://user:pass@localhost:3306/akkerman"
```

## Connection Pooling Best Practices

This backend implements SQLAlchemy connection pooling optimized for production:

- **pool_size=5**: Maintains 5 open connections in the pool
- **max_overflow=10**: Allows up to 10 additional temporary connections under load
- **pool_pre_ping=True**: Verifies connections are alive before using them (prevents "lost connection" errors)
- **pool_recycle=3600**: Recycles connections after 1 hour (prevents stale connections from long-lived processes)

These settings ensure efficient resource usage while preventing connection pool exhaustion.

## Docker

### Build

```bash
make docker-build-backend
```

### Run

```bash
docker run -p 5000:5000 -e DATABASE_URL="sqlite:///./data/akkerman.db" akkerman-backend:0.1.0
```

## Health Check

The `/healthz` endpoint verifies both application and database connectivity:

```bash
curl http://localhost:5000/healthz
```

**Healthy response (200):**
```json
{
  "status": "healthy"
}
```

**Unhealthy response (503):**
```json
{
  "status": "unhealthy",
  "error": "Database connection failed: ..."
}
```

## Dependencies

See [requirements.txt](./requirements.txt) for production dependencies.
See [requirements-dev.txt](./requirements-dev.txt) for development dependencies (includes testing, linting).

## License

Commercial license for Gergo Nagy. See [LICENSE.md](../LICENSE.md) for details.
