using Explorify.Persistence.Extensions;

namespace Explorify.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(
       this IServiceCollection services,
       IConfiguration configuration)
    {
        services
            .AddControllers()
            .ConfigureApiBehaviorOptions(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

        services
            .AddPersistence(configuration)
            .AddSwaggerGen()
            .AddAuthorization()
            .AddEndpointsApiExplorer();

        return services;
    }
}
