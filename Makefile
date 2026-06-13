.PHONY: build start stop health start-app stop-app start-api stop-api

build:
	echo "Building Docker containers..."
	docker compose build

start:
	echo "Starting Docker containers..."
	docker compose up -d

stop:
	echo "Stopping Docker containers..."
	docker compose down

health:
	@echo "Checking services health..."
	@failed=0; \
	printf "Checking backend API directly (http://localhost:5100/health)... "; \
	status=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5100/health || echo "000"); \
	if [ "$$status" = "200" ]; then \
		echo "✅ OK (Status $$status)"; \
	else \
		echo "❌ FAILED (Status $$status)"; \
		failed=1; \
	fi; \
	printf "Checking frontend serving directly (http://localhost:4200/)... "; \
	status=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200/ || echo "000"); \
	if [ "$$status" = "200" ]; then \
		echo "✅ OK (Status $$status)"; \
	else \
		echo "❌ FAILED (Status $$status)"; \
		failed=1; \
	fi; \
	printf "Checking API proxy via frontend (http://localhost:4200/api/health)... "; \
	status=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200/api/health || echo "000"); \
	if [ "$$status" = "200" ]; then \
		echo "✅ OK (Status $$status)"; \
	else \
		echo "❌ FAILED (Status $$status)"; \
		failed=1; \
	fi; \
	exit $$failed

start-app:
	echo "Starting the app!"
	cd frontend/hickory-lawn-care-services && npm start

stop-app:
	echo "Stopping the app!"
	pkill -f "ng serve" || true

start-api:
	echo "Starting the api!"
	cd backend/src/Hickory.Api && dotnet run

stop-api:
	echo "Stopping the api!"
	pkill -f dotnet || true


