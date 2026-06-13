using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Hickory.Api.Data;
using Hickory.Api.Models;
using YourProjectNamespace.Dtos;
using Xunit;

namespace Hickory.Api.Tests.Controllers;

public class ServiceRequestsControllerTests : IClassFixture<HickoryApiWebApplicationFactory>
{
    private readonly HickoryApiWebApplicationFactory _factory;

    public ServiceRequestsControllerTests(HickoryApiWebApplicationFactory factory)
    {
        _factory = factory;
    }

    private void SeedDatabase(Action<ApplicationDbContext> seedAction)
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        seedAction(context);
        context.SaveChanges();
    }

    [Fact]
    public async Task GetServiceRequests_ReturnsAllRequests()
    {
        // Arrange
        var client = _factory.CreateClient();
        
        // Seed some request
        SeedDatabase(db =>
        {
            db.ServiceRequests.Add(new ServiceRequest
            {
                CustomerName = "John Test",
                Phone = "123-456",
                Address = "123 Test St",
                ServiceType = "Mowing",
                Description = "Mow the lawn"
            });
        });

        // Act
        var response = await client.GetAsync("/api/servicerequests");

        // Assert
        response.EnsureSuccessStatusCode();
        var requests = await response.Content.ReadFromJsonAsync<List<ServiceRequest>>();
        Assert.NotNull(requests);
        Assert.NotEmpty(requests);
        Assert.Contains(requests, r => r.CustomerName == "John Test");
    }

    [Fact]
    public async Task GetServiceRequest_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/servicerequests/999999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetServiceRequest_WithValidId_ReturnsServiceRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new ServiceRequest
        {
            CustomerName = "Jane Test",
            Phone = "987-654",
            Address = "456 Test Ave",
            ServiceType = "Weeding",
            Description = "Pull weeds"
        };

        SeedDatabase(db =>
        {
            db.ServiceRequests.Add(request);
        });

        // Act
        var response = await client.GetAsync($"/api/servicerequests/{request.Id}");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ServiceRequest>();
        Assert.NotNull(result);
        Assert.Equal("Jane Test", result.CustomerName);
        Assert.Equal(request.Id, result.Id);
    }

    [Fact]
    public async Task CreateServiceRequest_WithValidData_ReturnsCreatedAndSavesToDb()
    {
        // Arrange
        var client = _factory.CreateClient();
        var dto = new CreateServiceRequestDto
        {
            CustomerName = "Alice Test",
            Phone = "555-1234",
            Address = "789 Test Rd",
            ServiceType = "Aeration",
            Description = "Aerate front yard"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/servicerequests", dto);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        
        var created = await response.Content.ReadFromJsonAsync<ServiceRequest>();
        Assert.NotNull(created);
        Assert.True(created.Id > 0);
        Assert.Equal(dto.CustomerName, created.CustomerName);
        Assert.Equal("New", created.Status);

        // Verify it actually exists in database
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var dbRequest = await db.ServiceRequests.FindAsync(created.Id);
        Assert.NotNull(dbRequest);
        Assert.Equal(dto.CustomerName, dbRequest.CustomerName);
    }
}
