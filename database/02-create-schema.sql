USE HickoryLawnCare;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ServiceRequests]') AND type in (N'U'))
BEGIN
    CREATE TABLE ServiceRequests (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CustomerName NVARCHAR(100) NOT NULL,
        Phone NVARCHAR(20) NOT NULL,
        Address NVARCHAR(255) NOT NULL,
        ServiceType NVARCHAR(50) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Status NVARCHAR(50) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT 'Table ServiceRequests created successfully.';
END
ELSE
BEGIN
    PRINT 'Table ServiceRequests already exists.';
END
GO
