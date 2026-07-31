# Midas - Financial Management API

A financial management backend for tracking accounts, transfers, and recoverable expenses.

**Version:** 0.1.0

## 📁 Repository Structure

```
midas/
├── VERSION.txt              # Semantic versioning (0.1.0)
├── LICENSE.md               # Commercial license (Gergo Nagy, Dutch law)
├── Makefile                 # CI/CD orchestration
├── README.md                # This file
├── frontend/                # Frontend application (TBD)
│   ├── README.md
│   └── Dockerfile
└── backend/                 # Financial management REST API
    ├── README.md
    ├── Dockerfile
    ├── requirements.txt
    ├── requirements-dev.txt
    ├── app.py               # Flask application entry point
    ├── config.py            # Environment configuration
    ├── database.py          # SQLAlchemy setup with scoped_session
    ├── models.py            # ORM models (Account, Source, Sink, Transfer, etc.)
    ├── routes/
    │   ├── health.py        # Health check endpoint
    │   └── transfers.py     # Transfer management with reclaimable feature
    ├── tests/
    │   ├── conftest.py      # Pytest configuration
    │   ├── test_health.py   # Health endpoint tests
    │   ├── test_database.py # Database tests
    │   └── test_reclaimable_transfers.py  # Reclaimable transfers tests (10/10 passing)
    └── schemas.py           # Pydantic v2 validation schemas
```

## 🎯 Features

### Reclaimable Transfers
The core feature allows tracking of recoverable expenses:

1. **Mark as Reclaimable**: Account → Sink transfers can be marked as reclaimable with an expected recovery source
2. **Record Recovery**: Source → Account transfers can reference the original reclaimable transfer
3. **Automatic Linking**: Recovery automatically links to and updates the original transfer in a single transaction
4. **Query History**: View pending recoveries and complete recovery history

Example workflow:
```bash
# 1. Create reclaimable expense (Account paid Sink)
POST /api/transfers
{
  "ingress_type": "account",
  "egress_type": "sink",
  "is_reclaimable": true,
  "reclaimable_source_name": "Insurance Co"
}

# 2. Record recovery (Source refunds Account)
POST /api/transfers
{
  "ingress_type": "source",
  "egress_type": "account",
  "reclaimed_from_transfer_id": "transfer-uuid-from-step-1"
}

# 3. Query results
GET /api/transfers/pending-recovery    # Unrecovered reclaimable transfers
GET /api/transfers/recovery-history    # Recovered transfers
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run backend
python app.py

# Run tests (including reclaimable transfers)
python -m pytest tests/test_reclaimable_transfers.py -v
```

### Docker

```bash
# Build backend container
docker build -t midas-backend:latest ./backend

# Run container
docker run -p 5000:5000 -e DATABASE_URL=sqlite:///data/midas.db midas-backend:latest
```

## 📝 Architecture

- **Backend**: Stateless Flask web service with SQLAlchemy ORM
- **Database**: SQLite by default, configurable via `DATABASE_URL` environment variable
- **Session Management**: scoped_session for proper cleanup per request
- **Models**: Account, Source, Sink, Category, Transfer, Upload
- **Validation**: 4-layer validation (Pydantic + business logic + database constraints + foreign keys)

## 🔄 Database Configuration

Set the `DATABASE_URL` environment variable to configure the database:

```bash
# SQLite (default)
DATABASE_URL="sqlite:///./data/midas.db"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/midas"

# MySQL
DATABASE_URL="mysql+pymysql://user:password@localhost:3306/midas"
```

## 🔌 API Endpoints

### Transfers
- `POST /api/transfers` - Create transfer (with reclaimable & recovery support)
- `GET /api/transfers/{id}` - Get transfer with recovery status
- `GET /api/transfers` - List transfers with filtering
- `GET /api/transfers/pending-recovery` - List unrecovered reclaimable transfers
- `GET /api/transfers/recovery-history` - List recovered transfers
- `PATCH /api/transfers/{id}` - Update transfer metadata
- `DELETE /api/transfers/{id}` - Delete transfer
- `GET /api/transfers/stats/summary` - Statistics

### Health
- `GET /health` - Service health check

## 📖 More Information

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Reclaimable Transfers Implementation](./backend/RECLAIMABLE_TRANSFERS_FINAL_IMPLEMENTATION.md)

## ✅ Testing

```bash
cd backend
# Run all tests
python -m pytest

# Run only reclaimable transfers tests
python -m pytest tests/test_reclaimable_transfers.py -v

# Current status: 10/10 tests passing ✅
```

## ⚖️ License

Commercial license for Gergo Nagy. See [LICENSE.md](./LICENSE.md) for details.
