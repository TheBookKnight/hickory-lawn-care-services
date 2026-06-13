using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hickory.Api.Data;
using Hickory.Api.Models;

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
}
