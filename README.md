# Hickory Lawn Care Services

Hickory Lawn Care Services is a full-stack web application built using:
- **Frontend**: Angular SPA (Single Page Application)
- **Backend**: ASP.NET Core Web API (running on .NET 10)
- **Database**: Microsoft SQL Server 2022

This repository contains all code and configurations to run the environment locally using Docker Compose and a `Makefile`.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Docker & Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Make](https://developer.apple.com/xcode/) (standard on macOS)

---

## Running the Application

### 1. Start the Environment
To start the database, backend API, and frontend application in the background:
```bash
make start
```
This spins up three containers:
- `hickory-db`: Microsoft SQL Server (Port `1433`)
- `hickory-backend-api`: ASP.NET Core API (Port `5100`)
- `hickory-frontend-app`: Angular Web App (Port `4200`)

To check if the services are healthy, run:
```bash
make health
```

### 2. Stop the Environment
To stop and remove the containers:
```bash
make stop
```

---

## Database Management

We use a Dockerized Microsoft SQL Server 2022 instance. The schema and initial seed data are managed using SQL scripts in the `database/` folder.

### Database Credentials
- **Host**: `localhost` (or `127.0.0.1`)
- **Port**: `1433`
- **Username**: `sa`
- **Password**: `HickoryLawnCare@2026!`
- **Database Name**: `HickoryLawnCare`

### Database Commands
The `Makefile` includes convenience commands to initialize, reset, and inspect the database:

#### Initialize Database
Creates the database, applies the schema, and seeds 10 sample records. This command waits for the database container to become fully ready before executing the scripts:
```bash
make db-init
```

#### Reset Database
Drops the existing database and recreates it with clean seed data:
```bash
make db-reset
```

#### Open Interactive SQL Shell
Starts an interactive command-line session (`sqlcmd`) inside the SQL Server container:
```bash
make db-shell
```
*Note: Type `QUIT` to exit the shell.*

---

## Verifying the Database & Seed Data

Once initialized, you can verify that the database is set up correctly.

1. Open the SQL Shell:
   ```bash
   make db-shell
   ```
2. Select the database:
   ```sql
   USE HickoryLawnCare;
   GO
   ```
3. Count the seeded service requests:
   ```sql
   SELECT COUNT(*) AS SeededCount FROM ServiceRequests;
   GO
   ```
   *Expected Output: `10`*

4. Exit the shell:
   ```sql
   QUIT
   ```

---

## Recommended SQL Clients

To view the database schema and query the tables visually, you can use any of the following free tools:

1. **Azure Data Studio** (Recommended for cross-platform SQL Server development)
   - Download: [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio)
2. **DBeaver** (General-purpose database management tool)
   - Download: [DBeaver](https://dbeaver.io/)
3. **VS Code SQL Server Extension**
   - Install the **SQL Server (mssql)** extension by Microsoft in VS Code.

### Connection Settings:
- **Connection Type**: Microsoft SQL Server
- **Server**: `localhost` (or `127.0.0.1,1433`)
- **Authentication Type**: SQL Login
- **Username**: `sa`
- **Password**: `HickoryLawnCare@2026!`
- **Trust Server Certificate**: `True` (Mandatory for local connections)
- **Database**: `HickoryLawnCare`

---

## Developer Learning Resources

To learn SQL queries or practice exploring the database:
- Refer to the [SQL Learning Guide](docs/sql-learning-guide.md) for step-by-step query walkthroughs and 5 interactive exercises with solutions.
