using System.ComponentModel.DataAnnotations;

namespace YourProjectNamespace.Dtos;

public class CreateServiceRequestDto
{
    [Required]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    public string ServiceType { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}
