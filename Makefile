.PHONY: help install install-dev run-backend test clean docker-build docker-build-backend docker-build-frontend healthz

# Get version from VERSION.txt
VERSION := $(shell cat VERSION.txt)
BACKEND_DIR := backend
FRONTEND_DIR := frontend

## help - Display this help message
help:
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║              Akkerman - Build & Development Commands           ║"
	@echo "║                      Version: $(VERSION)                          ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 Installation:"
	@grep -E '## ' $(MAKEFILE_LIST) | grep -E '^[a-zA-Z_-]+.*:.*## ' | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36mmake %-25s\033[0m %s\n", $$1, $$2}' | head -20

## install - Install production dependencies
install:
	@echo "[INFO] Installing production dependencies..."
	pip install -r $(BACKEND_DIR)/requirements.txt

## install-dev - Install development dependencies
install-dev:
	@echo "[INFO] Installing development dependencies..."
	pip install -r $(BACKEND_DIR)/requirements-dev.txt

## run-backend - Run Flask backend in development mode
run-backend:
	@echo "[INFO] Starting Flask backend (v$(VERSION))..."
	cd $(BACKEND_DIR) && python app.py

## test - Run all tests with coverage
test:
	@echo "[INFO] Running tests..."
	cd $(BACKEND_DIR) && pytest -v --cov=. tests/

## test-health - Quick test of health endpoint
test-health:
	@echo "[INFO] Testing /healthz endpoint..."
	cd $(BACKEND_DIR) && pytest -v tests/test_health.py

## test-db - Test database connectivity
test-db:
	@echo "[INFO] Testing database connectivity..."
	cd $(BACKEND_DIR) && pytest -v tests/test_database.py

## clean - Remove build artifacts and cache
clean:
	@echo "[INFO] Cleaning build artifacts..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name '*.pyc' -delete
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .coverage -delete 2>/dev/null || true
	find . -type d -name htmlcov -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name dist -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name build -exec rm -rf {} + 2>/dev/null || true
	@echo "[INFO] Clean complete"

## docker-build - Build all Docker images
docker-build: docker-build-backend docker-build-frontend
	@echo "[INFO] All Docker images built (v$(VERSION))"

## docker-build-backend - Build backend Docker image
docker-build-backend:
	@echo "[INFO] Building backend Docker image (v$(VERSION))..."
	docker build -t akkerman-backend:$(VERSION) -t akkerman-backend:latest -f $(BACKEND_DIR)/Dockerfile $(BACKEND_DIR)
	@echo "[INFO] Backend image built: akkerman-backend:$(VERSION)"

## docker-build-frontend - Build frontend Docker image
docker-build-frontend:
	@echo "[INFO] Building frontend Docker image (v$(VERSION))..."
	docker build -t akkerman-frontend:$(VERSION) -t akkerman-frontend:latest -f $(FRONTEND_DIR)/Dockerfile $(FRONTEND_DIR)
	@echo "[INFO] Frontend image built: akkerman-frontend:$(VERSION)"

## healthz - Check if backend is running and healthy
healthz:
	@echo "[INFO] Checking backend health..."
	@curl -s http://localhost:5000/healthz | python -m json.tool || echo "Backend is not running"

.PHONY: help install install-dev run-backend test test-health test-db clean docker-build docker-build-backend docker-build-frontend healthz
