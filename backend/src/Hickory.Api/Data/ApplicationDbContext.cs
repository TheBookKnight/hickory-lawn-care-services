/*
Acts as the bridge/translator between your C# code and 
the SQL Server database. The DbSet<ServiceRequest> tells 
EF Core that there is a table named ServiceRequests 
containing records of this type
*/
using Microsoft.EntityFrameworkCore;
using Hickory.Api.Models;

namespace Hickory.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
}
