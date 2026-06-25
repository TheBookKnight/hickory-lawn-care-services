USE HickoryLawnCare;
GO

IF NOT EXISTS (SELECT 1 FROM ServiceRequests)
BEGIN
    INSERT INTO ServiceRequests (CustomerName, Phone, Address, ServiceType, Description, Status, CreatedAt, PreferredDate)
    VALUES
    (N'Alice Smith', N'555-0100', N'123 Maple St, Hickory', N'Lawn Care', N'Weekly lawn mowing and edging for front and back yards.', N'Completed', '2026-05-15T09:00:00Z', '2026-05-16T10:00:00Z'),
    (N'Bob Jones', N'555-0101', N'456 Oak Ave, Hickory', N'Tree Removal', N'Large dead oak tree in backyard needs safe removal and stump grinding.', N'Scheduled', '2026-06-10T08:30:00Z', '2026-06-12T09:00:00Z'),
    (N'Charlie Brown', N'555-0102', N'789 Pine Rd, Hickory', N'Irrigation', N'Broken sprinkler head in zone 3 needs replacement.', N'New', '2026-06-12T14:15:00Z', '2026-06-15T14:00:00Z'),
    (N'Diana Prince', N'555-0103', N'101 Birch Ln, Hickory', N'Lawn Care', N'Overgrown yard cleanup - mowing tall grass, weeding flower beds, trimming hedges.', N'Quoted', '2026-06-08T10:00:00Z', '2026-06-10T11:00:00Z'),
    (N'Evan Wright', N'555-0104', N'202 Cedar Blvd, Hickory', N'Tree Removal', N'Fallen tree after storm blocking the driveway needs urgent removal.', N'Completed', '2026-06-01T17:45:00Z', '2026-06-03T08:00:00Z'),
    (N'Fiona Gallagher', N'555-0105', N'303 Elm St, Hickory', N'Irrigation', N'Irrigation line leak detected under the driveway path.', N'Quoted', '2026-06-09T11:20:00Z', '2026-06-11T13:00:00Z'),
    (N'George Costanza', N'555-0106', N'404 Walnut Dr, Hickory', N'Lawn Care', N'Bi-weekly lawn mowing and leaf blowing.', N'Scheduled', '2026-06-11T13:00:00Z', '2026-06-12T10:00:00Z'),
    (N'Hannah Abbott', N'555-0107', N'505 Cherry Ct, Hickory', N'Tree Removal', N'Trimming overgrown maple branches hanging over the roof.', N'New', '2026-06-13T09:30:00Z', '2026-06-16T09:00:00Z'),
    (N'Ian Malcolm', N'555-0108', N'606 Willow Way, Hickory', N'Irrigation', N'Upgrading sprinkler controller to a smart system.', N'Completed', '2026-05-28T10:00:00Z', '2026-05-30T10:00:00Z'),
    (N'Julia Roberts', N'555-0109', N'707 Magnolia Dr, Hickory', N'Lawn Care', N'Aerate and overseed the entire lawn.', N'New', '2026-06-13T15:00:00Z', '2026-06-17T11:00:00Z');

    PRINT 'Seeded 10 service request records successfully.';
END
ELSE
BEGIN
    PRINT 'ServiceRequests table already contains data. Seeding skipped.';
END
GO
