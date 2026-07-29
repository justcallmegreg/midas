# Akkerman - Web Scraping & API Backend

A monorepo containing a web scraper backend and web service API.

**Version:** 0.1.0

## 📁 Repository Structure

```
akkerman/
├── VERSION.txt              # Semantic versioning (0.1.0)
├── LICENSE.md               # Commercial license (Gergo Nagy, Dutch law)
├── Makefile                 # CI/CD orchestration
├── README.md               # This file
├── frontend/               # Frontend application (TBD)
│   ├── README.md
│   └── Dockerfile
└── backend/                # Backend web service and crawler
    ├── README.md
    ├── Dockerfile
    ├── requirements.txt
    ├── requirements-dev.txt
    ├── app.py              # Flask application entry point
    ├── config.py           # Environment configuration
    ├── database.py         # SQLAlchemy setup
    ├── models.py           # ORM models
    ├── routes/
    │   └── health.py       # Health check endpoint
    ├── tests/
    │   ├── conftest.py     # Pytest configuration
    │   ├── test_health.py  # Health endpoint tests
    │   └── test_database.py# Database tests
    └── akkerman/           # Scrapy crawler (legacy)
        └── ...
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
make install

# Run backend
make run-backend

# Run tests
make test

# View all available commands
make help
```

### Docker

```bash
# Build backend container
make docker-build-backend

# Build frontend container
make docker-build-frontend

# Build all
make docker-build
```

## 📝 Architecture

- **Backend**: Stateless Flask web service with SQLAlchemy ORM
- **Database**: SQLite by default, configurable via `DATABASE_URL` environment variable
- **Health Check**: `/healthz` endpoint returns 200 with `{"status": "healthy"}` when service is up
- **Connection Pooling**: Optimized for concurrent database access with connection pre-ping and recycling

## 🔄 Database Configuration

Set the `DATABASE_URL` environment variable to configure the database:

```bash
# SQLite (default)
DATABASE_URL="sqlite:///./data/akkerman.db"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/akkerman"

# MySQL
DATABASE_URL="mysql+pymysql://user:password@localhost:3306/akkerman"
```

## 📖 More Information

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## ⚖️ License

Commercial license for Gergo Nagy. See [LICENSE.md](./LICENSE.md) for details.
