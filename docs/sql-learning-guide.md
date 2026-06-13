# SQL Learning Guide

Welcome to the SQL Learning Guide for Hickory Lawn Care Services! This guide will teach you how to explore the database, execute basic queries, and understand the structure of the data.

---

## Connection Options

You have two primary ways to run queries: using a graphical client like DBeaver or using the command-line shell.

### Option A: DBeaver GUI Client (Recommended)
To explore and query the database visually using DBeaver:
1. Open DBeaver, click the **Plug** icon (New Connection), and choose **MS SQL Server**.
2. Under **Server** settings:
   - **Host**: `localhost`
   - **Port**: `1433`
   - **Database/Schema**: `HickoryLawnCare`
3. Under **Authentication** settings:
   - **Authentication**: `SQL Server Authentication`
   - **Username**: `sa`
   - **Password**: `HickoryLawnCare@2026!`
4. Under **Settings**:
   - Check the **Trust Server Certificate** checkbox. (This is required because the database container uses a self-signed developer certificate).
5. Click **Test Connection ...** to verify, then click **Finish**.

### Option B: Interactive SQL Shell (CLI)
You can start a SQL command-line shell directly inside the container by running:
```bash
make db-shell
```
Once inside, select the `HickoryLawnCare` database by running:
```sql
USE HickoryLawnCare;
GO
```

---

## Example Queries

### 1. View All Requests
Retrieve all records from the `ServiceRequests` table.
```sql
SELECT *
FROM ServiceRequests;
GO
```

### 2. Filter By Status
Find all requests that have a status of `'New'`.
```sql
SELECT *
FROM ServiceRequests
WHERE Status = 'New';
GO
```

### 3. Count Requests
Find the total number of requests in the system.
```sql
SELECT COUNT(*) AS TotalRequests
FROM ServiceRequests;
GO
```

### 4. Count Requests By Service Type
Group and count requests by the type of service requested.
```sql
SELECT ServiceType, COUNT(*) AS RequestCount
FROM ServiceRequests
GROUP BY ServiceType;
GO
```

### 5. Sort By Date
View all requests, starting from the newest.
```sql
SELECT *
FROM ServiceRequests
ORDER BY CreatedAt DESC;
GO
```

---

## Learning Exercises

Practice writing SQL queries with the following exercises. Each exercise includes the SQL query solution and the expected output based on the initial seed data.

### Exercise 1: Find all completed jobs
Write a query to retrieve all service requests that have been completed.

<details>
<summary>Reveal Solution</summary>

```sql
SELECT *
FROM ServiceRequests
WHERE Status = 'Completed';
GO
```

#### Expected Output:
| Id | CustomerName | Phone | Address | ServiceType | Description | Status | CreatedAt |
|----|--------------|-------|---------|-------------|-------------|--------|-----------|
| 1 | Alice Smith | 555-0100 | 123 Maple St, Hickory | Lawn Care | Weekly lawn mowing... | Completed | 2026-05-15 09:00:00 |
| 5 | Evan Wright | 555-0104 | 202 Cedar Blvd, Hickory | Tree Removal | Fallen tree after storm... | Completed | 2026-06-01 17:45:00 |
| 9 | Ian Malcolm | 555-0108 | 606 Willow Way, Hickory | Irrigation | Upgrading sprinkler... | Completed | 2026-05-28 10:00:00 |

</details>

---

### Exercise 2: Find all tree removal requests
Write a query to retrieve all service requests where the service type is exactly `'Tree Removal'`.

<details>
<summary>Reveal Solution</summary>

```sql
SELECT *
FROM ServiceRequests
WHERE ServiceType = 'Tree Removal';
GO
```

#### Expected Output:
| Id | CustomerName | Phone | Address | ServiceType | Description | Status | CreatedAt |
|----|--------------|-------|---------|-------------|-------------|--------|-----------|
| 2 | Bob Jones | 555-0101 | 456 Oak Ave, Hickory | Tree Removal | Large dead oak tree... | Scheduled | 2026-06-10 08:30:00 |
| 5 | Evan Wright | 555-0104 | 202 Cedar Blvd, Hickory | Tree Removal | Fallen tree after storm... | Completed | 2026-06-01 17:45:00 |
| 8 | Hannah Abbott | 555-0107 | 505 Cherry Ct, Hickory | Tree Removal | Trimming overgrown... | New | 2026-06-13 09:30:00 |

</details>

---

### Exercise 3: Count requests by status
Write a query that shows each status and how many requests are in that status.

<details>
<summary>Reveal Solution</summary>

```sql
SELECT Status, COUNT(*) AS TotalCount
FROM ServiceRequests
GROUP BY Status;
GO
```

#### Expected Output:
| Status | TotalCount |
|--------|------------|
| Completed | 3 |
| New | 3 |
| Quoted | 2 |
| Scheduled | 2 |

</details>

---

### Exercise 4: Find the newest request
Write a query to find the single most recently created service request.

<details>
<summary>Reveal Solution</summary>

```sql
SELECT TOP 1 *
FROM ServiceRequests
ORDER BY CreatedAt DESC;
GO
```

#### Expected Output:
| Id | CustomerName | Phone | Address | ServiceType | Description | Status | CreatedAt |
|----|--------------|-------|---------|-------------|-------------|--------|-----------|
| 10 | Julia Roberts | 555-0109 | 707 Magnolia Dr, Hickory | Lawn Care | Aerate and overseed... | New | 2026-06-13 15:00:00 |

</details>

---

### Exercise 5: Count open requests
Write a query to count how many requests are currently "open" (i.e., status is *not* `'Completed'`).

<details>
<summary>Reveal Solution</summary>

```sql
SELECT COUNT(*) AS OpenRequestsCount
FROM ServiceRequests
WHERE Status <> 'Completed';
GO
```

#### Expected Output:
| OpenRequestsCount |
|-------------------|
| 7 |

</details>
