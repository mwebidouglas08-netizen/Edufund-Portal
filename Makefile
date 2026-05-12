# EduFund Portal — Makefile
# Shortcuts for common development tasks

.PHONY: help dev build start db-migrate db-seed db-reset db-studio \
        docker-up docker-down docker-logs install clean

## ─── Help ────────────────────────────────────────────────────
help:
	@echo "EduFund Portal — Available Commands"
	@echo "────────────────────────────────────"
	@echo "  make install      Install dependencies"
	@echo "  make dev          Start development server"
	@echo "  make build        Build for production"
	@echo "  make db-migrate   Run database migrations"
	@echo "  make db-seed      Seed sample data"
	@echo "  make db-reset     Reset + reseed database"
	@echo "  make db-studio    Open Prisma Studio"
	@echo "  make docker-up    Start Docker services"
	@echo "  make docker-down  Stop Docker services"
	@echo "  make docker-logs  View Docker logs"
	@echo "  make clean        Remove build artifacts"

## ─── Development ──────────────────────────────────────────────
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

## ─── Database ─────────────────────────────────────────────────
db-migrate:
	npm run db:migrate

db-seed:
	npm run db:seed

db-reset:
	npm run db:reset

db-studio:
	npm run db:studio

db-generate:
	npm run db:generate

## ─── Docker ───────────────────────────────────────────────────
docker-up:
	docker-compose up -d
	@echo "✅ Services started"
	@echo "   App: http://localhost:3000"
	@echo "   DB:  postgresql://edufund:edufund_pass@localhost:5432/edufund_db"

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f app

docker-build:
	docker-compose up -d --build

## ─── Setup ────────────────────────────────────────────────────
setup: install
	@cp -n .env.example .env.local || true
	@echo "✅ .env.local created — edit with your values"

setup-db: db-migrate db-seed
	@echo "✅ Database ready"
	@echo "   Admin: admin@edufund.co.ke / Admin@1234"
	@echo "   Student: student@test.co.ke / Student@1234"

## ─── Clean ────────────────────────────────────────────────────
clean:
	rm -rf .next out node_modules/.cache

clean-all:
	rm -rf .next out node_modules
