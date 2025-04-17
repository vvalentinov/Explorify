using Explorify.Persistence;
using Explorify.Persistence.Identity;
using Explorify.Persistence.Extensions;
using Explorify.Application.Extensions;
using Explorify.Infrastructure.Extensions;

using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

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

        services.AddFluentValidationAutoValidation(config =>
        {
            config.OverrideDefaultResultFactoryWith<CustomResultFactory>();
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
            .AddInfrastructure(configuration)
            .AddApplication()
            .AddSwaggerGen()
            .AddAuthorization()
            .AddEndpointsApiExplorer()
            .AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyHeader()
                           .AllowAnyMethod()
                           .SetIsOriginAllowed((host) => true)
                           .AllowCredentials();
                }));

        return services;
    }
}
