/*
This is a data model class that represents a single row
in the ServiceRequests table. Each property maps directly
to a column in that table.
*/
using System;

namespace Hickory.Api.Models;

public class ServiceRequest
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    private DateTime _preferredDate;
    public DateTime PreferredDate
    {
        get => _preferredDate;
        set => _preferredDate = TruncateToSeconds(value);
    }

    public string Status { get; set; } = "New";
    public string? InternalNotes { get; set; }

    private DateTime _createdAt = TruncateToSeconds(DateTime.UtcNow);
    public DateTime CreatedAt
    {
        get => _createdAt;
        set => _createdAt = TruncateToSeconds(value);
    }

    private static DateTime TruncateToSeconds(DateTime dt)
    {
        return new DateTime(dt.Ticks - (dt.Ticks % TimeSpan.TicksPerSecond), dt.Kind);
    }
}
