using Explorify.Application;

using Microsoft.Extensions.DependencyInjection;

namespace Explorify.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
       this IServiceCollection services)
    {
        services.AddTransient<ITokenService, TokenService>();

        return services;
    }
}
