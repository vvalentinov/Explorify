using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Explorify.Persistence.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var dbConnection = configuration.GetConnectionString("DbConnection");

        services.AddDbContext<ExplorifyDbContext>(options =>
            options.UseSqlServer(dbConnection));

        return services;
    }
}
