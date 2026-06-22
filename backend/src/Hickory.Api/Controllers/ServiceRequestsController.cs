using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hickory.Api.Data;
using Hickory.Api.Models;
using YourProjectNamespace.Dtos;

namespace Hickory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceRequestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServiceRequestsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/servicerequests
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceRequest>>> GetServiceRequests()
    {
        var requests = await _context.ServiceRequests.ToListAsync();
        return Ok(requests);
    }

    // GET: api/servicerequests/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceRequest>> GetServiceRequest(int id)
    {
        var serviceRequest = await _context.ServiceRequests.FindAsync(id);

        if (serviceRequest == null)
        {
            return NotFound();
        }

        return Ok(serviceRequest);
    }

    // POST: api/servicerequests
    [HttpPost]
    public async Task<ActionResult<ServiceRequest>> CreateServiceRequest([FromBody] CreateServiceRequestDto dto)
    {
        // 1. Map the DTO data to your SQL database entity model
        var serviceRequest = new ServiceRequest
        {
            CustomerName = dto.CustomerName,
            Phone = dto.Phone,
            Address = dto.Address,
            ServiceType = dto.ServiceType,
            Description = dto.Description,
            PreferredDate = dto.PreferredDate,
            Status = "New" // Automatically set a default status for new entries
        };

        // 2. Stage the object in EF Core tracking
        _context.ServiceRequests.Add(serviceRequest);

        // 3. Push changes to the Docker SQL Server instance (this generates the ID)
        await _context.SaveChangesAsync();

        // 4. Return the created entity with a 201 status code
        // This looks for your GET endpoint to build the location URL header
        return CreatedAtAction(nameof(GetServiceRequest), new { id = serviceRequest.Id }, serviceRequest);
    }
}
