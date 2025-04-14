using Microsoft.Extensions.DependencyInjection;

namespace Explorify.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
       this IServiceCollection services)
    {
        return services;
    }
}
