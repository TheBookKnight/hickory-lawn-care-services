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
                Description = "Mow the lawn",
                PreferredDate = new DateTime(2026, 6, 23, 9, 0, 0, DateTimeKind.Utc)
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
            Description = "Pull weeds",
            PreferredDate = new DateTime(2026, 6, 24, 10, 0, 0, DateTimeKind.Utc)
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
        Assert.Equal(request.PreferredDate, result.PreferredDate);
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
            Description = "Aerate front yard",
            PreferredDate = new DateTime(2026, 6, 25, 11, 0, 0, DateTimeKind.Utc)
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/servicerequests", dto);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        
        var created = await response.Content.ReadFromJsonAsync<ServiceRequest>();
        Assert.NotNull(created);
        Assert.True(created.Id > 0);
        Assert.Equal(dto.CustomerName, created.CustomerName);
        Assert.Equal(dto.PreferredDate, created.PreferredDate);
        Assert.Equal("New", created.Status);

        // Verify it actually exists in database
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var dbRequest = await db.ServiceRequests.FindAsync(created.Id);
        Assert.NotNull(dbRequest);
        Assert.Equal(dto.CustomerName, dbRequest.CustomerName);
        Assert.Equal(dto.PreferredDate, dbRequest.PreferredDate);
    }

    [Fact]
    public async Task UpdateServiceRequest_WithValidData_UpdatesOnlyAllowedFields()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new ServiceRequest
        {
            CustomerName = "Charlie Original",
            Phone = "111-222",
            Address = "123 Main St",
            ServiceType = "Mowing",
            Description = "Original description",
            PreferredDate = new DateTime(2026, 6, 26, 8, 0, 0, DateTimeKind.Utc),
            Status = "New"
        };

        SeedDatabase(db =>
        {
            db.ServiceRequests.Add(request);
        });

        var dto = new UpdateServiceRequestDto
        {
            Status = "Completed",
            Description = "Updated description",
            InternalNotes = "Task completed successfully."
        };

        // Act
        var response = await client.PutAsJsonAsync($"/api/servicerequests/{request.Id}", dto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updated = await response.Content.ReadFromJsonAsync<ServiceRequest>();
        Assert.NotNull(updated);
        Assert.Equal(request.Id, updated.Id);
        Assert.Equal(dto.Status, updated.Status);
        Assert.Equal(dto.Description, updated.Description);
        Assert.Equal(dto.InternalNotes, updated.InternalNotes);
        
        // Ensure read-only properties did not change
        Assert.Equal("Charlie Original", updated.CustomerName);
        Assert.Equal("111-222", updated.Phone);
        Assert.Equal("123 Main St", updated.Address);
        Assert.Equal("Mowing", updated.ServiceType);
        Assert.Equal(request.PreferredDate, updated.PreferredDate);
        Assert.Equal(request.CreatedAt, updated.CreatedAt);

        // Verify changes in the actual database
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var dbRequest = await db.ServiceRequests.FindAsync(request.Id);
        Assert.NotNull(dbRequest);
        Assert.Equal(dto.Status, dbRequest.Status);
        Assert.Equal(dto.Description, dbRequest.Description);
        Assert.Equal(dto.InternalNotes, dbRequest.InternalNotes);
        Assert.Equal("Charlie Original", dbRequest.CustomerName);
    }

    [Fact]
    public async Task UpdateServiceRequest_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var client = _factory.CreateClient();
        var dto = new UpdateServiceRequestDto
        {
            Status = "Completed",
            Description = "Test",
            InternalNotes = "Notes"
        };

        // Act
        var response = await client.PutAsJsonAsync("/api/servicerequests/99999", dto);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

}
