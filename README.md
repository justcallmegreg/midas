# Midas - Data Intelligence Platform

> A modern, stateless data intelligence platform combining web scraping capabilities with a scalable backend and responsive frontend.

## Project Structure

This is a monorepo containing two primary services:

- **[Backend](./backend/)** - Python Flask REST API with SQLAlchemy ORM and configurable database support
- **[Frontend](./frontend/)** - Web interface for the data intelligence platform

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.10+
- Node.js 18+ (for frontend development)
- Make

### Development

```bash
# View available commands
make help

# Start all services in development mode
make dev

# Run backend tests
make test-backend

# Run frontend tests
make test-frontend
```

### Production

```bash
# Build Docker images
make build

# Start services with Docker Compose
make up

# View logs
make logs
```

## Version

Current version: **0.1.0** (see [VERSION.txt](./VERSION.txt))

## Architecture

### Backend

- **Framework:** Flask (Python)
- **Database:** SQLAlchemy with configurable backends (SQLite default)
- **Database URL:** Configurable via `DATABASE_URL` environment variable
- **Health Check:** `/healthz` endpoint

### Frontend

- Web-based interface for data exploration and configuration

## Development Guidelines

### Code Organization

```
backend/
├── app/
│   ├── __init__.py          # App factory
│   ├── config.py            # Configuration management
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # Data models
│   └── routes/              # API endpoints
├── tests/                   # Test suite
├── Dockerfile               # Container definition
└── requirements.txt         # Python dependencies

frontend/
├── src/
├── public/
├── Dockerfile               # Container definition
└── package.json            # Node dependencies
```

## License

This project is licensed under a Commercial License. See [COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md) for details.

## Contributing

All work must follow the contribution guidelines and is subject to the commercial license terms.

---

**Project Owner:** Gergo Nagy

**Last Updated:** 2024
