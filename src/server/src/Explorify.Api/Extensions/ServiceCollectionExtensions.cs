using Explorify.Persistence;
using Explorify.Persistence.Identity;
using Explorify.Persistence.Extensions;
using Explorify.Application.Extensions;
using Explorify.Infrastructure.Extensions;

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

        services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.Password.RequiredLength = 6;
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
        }).AddEntityFrameworkStores<ExplorifyDbContext>();

        services
            .AddPersistence(configuration)
            .AddInfrastructure()
            .AddApplication()
            .AddSwaggerGen()
            .AddAuthorization()
            .AddEndpointsApiExplorer();

        return services;
    }
}
