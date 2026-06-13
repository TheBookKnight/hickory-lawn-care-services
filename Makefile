.PHONY: build start stop health start-app stop-app start-api stop-api db-init db-reset db-shell

build:
	echo "Building Docker containers..."
	docker compose build

start:
	echo "Starting Docker containers..."
	docker compose up -d

stop:
	echo "Stopping Docker containers..."
	docker compose down

db-init:
	@echo "Waiting for SQL Server to be ready..."
	@for i in {1..30}; do \
		docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "HickoryLawnCare@2026!" -C -Q "SELECT 1" >/dev/null 2>&1 && echo "SQL Server is ready!" && break; \
		echo "Waiting for database to be ready... ($$i/30)"; \
		sleep 1; \
	done
	@echo "Running SQL initialization scripts..."
	docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "HickoryLawnCare@2026!" -C -i /database/01-create-database.sql
	docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "HickoryLawnCare@2026!" -C -i /database/02-create-schema.sql
	docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "HickoryLawnCare@2026!" -C -i /database/03-seed-data.sql
	@echo "Database initialization complete!"

db-reset:
	@echo "Dropping database HickoryLawnCare..."
	docker compose exec -T db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "HickoryLawnCare@2026!" -C -Q "IF EXISTS (SELECT * FROM sys.databases WHERE name = 'HickoryLawnCare') BEGIN ALTER DATABASE HickoryLawnCare SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE HickoryLawnCare; END"
	$(MAKE) db-init

db-shell:
	docker compose exec -it db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "HickoryLawnCare@2026!" -C

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


