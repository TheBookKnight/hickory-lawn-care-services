USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HickoryLawnCare')
BEGIN
    CREATE DATABASE HickoryLawnCare;
    PRINT 'Database HickoryLawnCare created successfully.';
END
ELSE
BEGIN
    PRINT 'Database HickoryLawnCare already exists.';
END
GO
