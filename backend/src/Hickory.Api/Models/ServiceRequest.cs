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
    public string Status { get; set; } = "New";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
