using System.ComponentModel.DataAnnotations;
/**
Keep CustomerName, Phone, Address, or PreferredDate as read-only
**/

namespace YourProjectNamespace.Dtos;

public class UpdateServiceRequestDto
{
    [Required]
    public string Status { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public string? InternalNotes { get; set; }
}