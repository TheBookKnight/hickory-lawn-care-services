# Hickory Lawn Care Services - Backend API

This is the backend API for the Hickory Lawn Care Services application, built using ASP.NET Core on .NET 10 and Entity Framework Core.

---

## Prerequisites

To run this API, you need:
1. **.NET 10 SDK** installed on your host machine.
2. **Docker** to run the local SQL Server database.

---

## Database Connection

The API connects to a Microsoft SQL Server 2022 instance. 

### Local Credentials
- **Host**: `localhost,1433` (when running the API locally) or `db,1433` (when running inside Docker Compose)
- **User ID**: `sa`
- **Password**: `HickoryLawnCare@2026!`
- **Database**: `HickoryLawnCare`

The connection string is configured in `appsettings.json` (for local development) and overridden via environment variables in `docker-compose.yml` (for Docker container deployment).

---

## Running the API

### Option A: Run inside Docker (Recommended)
You can boot the entire stack (Database, API, Frontend) from the repository root:
```bash
make start
```
The API will be exposed on **`http://localhost:5100`**.

To rebuild the API image after making C# changes:
```bash
make build
make start
```

### Option B: Run locally on Host Machine
1. Start only the SQL Server database container:
   ```bash
   docker compose up -d db
   ```
2. Navigate to the API project directory:
   ```bash
   cd backend/src/Hickory.Api
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
The API will be exposed on **`http://localhost:5291`** (HTTP) and `https://localhost:7134` (HTTPS).

---

## API Documentation (OpenAPI / Swagger)

This API includes native support for OpenAPI document generation. When running in the `Development` environment, the raw OpenAPI JSON specification is available at:

- **Inside Docker**: `http://localhost:5100/openapi/v1.json`
- **Local Host**: `http://localhost:5291/openapi/v1.json`

### Exploring Visual Swagger Docs
Since .NET 10 doesn't bundle the Swagger UI page by default, you can view the documentation visually using any of the following methods:
1. **Swagger Editor**: Copy and paste the OpenAPI JSON URL into [Swagger Editor](https://editor.swagger.io/).
2. **VS Code Extensions**: Install extensions like **OpenAPI Swagger Editor** or **REST Client** to interact with the endpoints directly.

---

## Endpoint Reference

### 1. Health Check
Checks if the API is active.
* **HTTP Method**: `GET`
* **Path**: `/health`
* **Response**: `200 OK` (Status text: `Healthy`)

---

### 2. Get All Service Requests
Fetches a list of all seeded or created service requests.
* **HTTP Method**: `GET`
* **Path**: `/api/servicerequests`
* **Response**: `200 OK`
* **Response Body Example**:
  ```json
  [
    {
      "id": 1,
      "customerName": "Alice Smith",
      "phone": "555-0100",
      "address": "123 Maple St, Hickory",
      "serviceType": "Lawn Care",
      "description": "Weekly lawn mowing and edging for front and back yards.",
      "status": "Completed",
      "createdAt": "2026-05-15T09:00:00"
    }
  ]
  ```

---

### 3. Get Service Request by ID
Retrieves details of a specific service request.
* **HTTP Method**: `GET`
* **Path**: `/api/servicerequests/{id}`
* **Response**: `200 OK` or `404 Not Found`

---

### 4. Create Service Request
Submits a new service request to the database.
* **HTTP Method**: `POST`
* **Path**: `/api/servicerequests`
* **Request Headers**: `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "customerName": "John Doe",
    "phone": "555-9999",
    "address": "777 Hickory Lane",
    "serviceType": "Irrigation",
    "description": "Sprinkler zone 2 not turning on."
  }
  ```
* **Response**: `201 Created` (with the generated `id` and status defaulted to `New`)
* **Response Body Example**:
  ```json
  {
    "id": 11,
    "customerName": "John Doe",
    "phone": "555-9999",
    "address": "777 Hickory Lane",
    "serviceType": "Irrigation",
    "description": "Sprinkler zone 2 not turning on.",
    "status": "New",
    "createdAt": "2026-06-13T23:15:22.456891Z"
  }
  ```
