using System.Net;
using Xunit;

namespace Hickory.Api.Tests;

public class HealthCheckTests : IClassFixture<HickoryApiWebApplicationFactory>
{
    private readonly HickoryApiWebApplicationFactory _factory;

    public HealthCheckTests(HickoryApiWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_Health_ReturnsHealthy()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/health");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Equal("Healthy", content);
    }
}
