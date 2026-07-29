.PHONY: help build dev up down logs clean test test-backend test-frontend lint format

# Configuration
VERSION := $(shell cat VERSION.txt)
DOCKER_COMPOSE = docker-compose
COMPOSE_FILE = docker-compose.yml

# Colors for output
BLUE = \033[0;34m
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

##@ General

.DEFAULT_GOAL := help

help: ## Display this help message
	@echo "$(BLUE)Midas - Data Intelligence Platform$(NC)"
	@echo "$(BLUE)Version: $(VERSION)$(NC)"
	@echo ""
	@echo "$(YELLOW)Usage:$(NC)"
	@echo "  make $(BLUE)<target>$(NC)"
	@echo ""
	@echo "$(YELLOW)Targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make build              # Build all Docker images"
	@echo "  make dev                # Start services in development mode"
	@echo "  make test-backend       # Run backend tests"
	@echo "  make logs               # View service logs"
	@echo ""

##@ Development

dev: ## Start all services in development mode
	@echo "$(GREEN)Starting services in development mode...$(NC)"
	$(DOCKER_COMPOSE) up

dev-d: ## Start all services in development mode (detached)
	@echo "$(GREEN)Starting services in development mode (detached)...$(NC)"
	$(DOCKER_COMPOSE) up -d

backend-dev: ## Run backend in development mode (local)
	@echo "$(GREEN)Starting backend in development mode...$(NC)"
	cd backend && python app.py

frontend-dev: ## Run frontend in development mode (local)
	@echo "$(GREEN)Starting frontend in development mode...$(NC)"
	cd frontend && npm run dev

##@ Docker

build: ## Build all Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build

build-backend: ## Build backend Docker image
	@echo "$(GREEN)Building backend Docker image...$(NC)"
	$(DOCKER_COMPOSE) build backend

build-frontend: ## Build frontend Docker image
	@echo "$(GREEN)Building frontend Docker image...$(NC)"
	$(DOCKER_COMPOSE) build frontend

up: ## Start all services (detached)
	@echo "$(GREEN)Starting services...$(NC)"
	$(DOCKER_COMPOSE) up -d

down: ## Stop all services
	@echo "$(GREEN)Stopping services...$(NC)"
	$(DOCKER_COMPOSE) down

restart: ## Restart all services
	@echo "$(GREEN)Restarting services...$(NC)"
	$(DOCKER_COMPOSE) restart

logs: ## Show logs from all services
	@echo "$(YELLOW)Showing logs (Ctrl+C to exit)...$(NC)"
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## Show logs from backend service
	@echo "$(YELLOW)Showing backend logs...$(NC)"
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## Show logs from frontend service
	@echo "$(YELLOW)Showing frontend logs...$(NC)"
	$(DOCKER_COMPOSE) logs -f frontend

##@ Testing

test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	cd backend && pytest -v

test-backend-coverage: ## Run backend tests with coverage report
	@echo "$(GREEN)Running backend tests with coverage...$(NC)"
	cd backend && pytest --cov=app --cov-report=html tests/

test-frontend: ## Run frontend tests
	@echo "$(GREEN)Running frontend tests...$(NC)"
	cd frontend && npm run test

test-frontend-coverage: ## Run frontend tests with coverage report
	@echo "$(GREEN)Running frontend tests with coverage...$(NC)"
	cd frontend && npm run test:coverage

##@ Code Quality

lint: lint-backend lint-frontend ## Run all linters

lint-backend: ## Lint backend code
	@echo "$(GREEN)Linting backend code...$(NC)"
	cd backend && pylint app/ || true

lint-frontend: ## Lint frontend code
	@echo "$(GREEN)Linting frontend code...$(NC)"
	cd frontend && npm run lint || true

format: format-backend format-frontend ## Format all code

format-backend: ## Format backend code
	@echo "$(GREEN)Formatting backend code...$(NC)"
	cd backend && black app/ tests/ || true
	cd backend && isort app/ tests/ || true

format-frontend: ## Format frontend code
	@echo "$(GREEN)Formatting frontend code...$(NC)"
	cd frontend && npm run format || true

##@ Database

db-init: ## Initialize database
	@echo "$(GREEN)Initializing database...$(NC)"
	cd backend && flask db init || true

db-migrate: ## Create database migration
	@echo "$(GREEN)Creating database migration...$(NC)"
	cd backend && flask db migrate || true

db-upgrade: ## Apply database migrations
	@echo "$(GREEN)Applying database migrations...$(NC)"
	cd backend && flask db upgrade || true

##@ Maintenance

clean: ## Clean up temporary files and caches
	@echo "$(GREEN)Cleaning up...$(NC)"
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".coverage" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -prune -o -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	@echo "$(YELLOW)Note: node_modules and dist directories preserved (use 'make clean-all' to remove)$(NC)"

clean-all: clean ## Deep clean including node_modules and build artifacts
	@echo "$(GREEN)Deep cleaning...$(NC)"
	rm -rf backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist
	rm -rf backend/*.db frontend/*.db
	@echo "$(GREEN)Deep clean complete$(NC)"

version: ## Display current version
	@echo "$(BLUE)Midas Version: $(VERSION)$(NC)"

##@ Installation

install: install-backend install-frontend ## Install all dependencies

install-backend: ## Install backend dependencies
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	cd backend && pip install -r requirements.txt

install-frontend: ## Install frontend dependencies
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	cd frontend && npm install

##@ Health

health: ## Check health of all services
	@echo "$(YELLOW)Checking backend health...$(NC)"
	@curl -s http://localhost:5000/healthz | jq . || echo "$(YELLOW)Backend not responding$(NC)"

##@ CI/CD

ci-test: ## Run tests in CI environment
	@echo "$(GREEN)Running CI tests...$(NC)"
	make test
	make lint

ci-build: ## Build images for CI deployment
	@echo "$(GREEN)Building for CI...$(NC)"
	make build

ci-push: ci-build ## Build and push images for CI (placeholder)
	@echo "$(YELLOW)Push target - configure your registry$(NC)"

.PHONY: help build dev up down logs clean test test-backend test-frontend lint format version
