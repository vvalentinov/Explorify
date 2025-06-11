using Explorify.Api.DTOs.Validators;
using Explorify.Persistence.Extensions;
using Explorify.Application.Extensions;
using Explorify.Infrastructure.Extensions;

using FluentValidation;
using Azure.Monitor.OpenTelemetry.AspNetCore;
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

        services.AddSignalR();

        services
            .AddHttpContextAccessor()
            .AddHttpClient()
            .AddMemoryCache()
            .AddExceptionHandler<GlobalExceptionHandler>()
            .AddProblemDetails()
            .AddPersistence(configuration)
            .AddInfrastructure(configuration)
            .AddApplication()
            .AddSwaggerGen()
            .AddAuthorization()
            .AddEndpointsApiExplorer()
            .AddCORS()
            .AddFluentValidationAutoValidation(config =>
            {
                config.DisableBuiltInModelValidation = true;
                config.EnableFormBindingSourceAutomaticValidation = true;
                config.OverrideDefaultResultFactoryWith<CustomResultFactory>();
            })
            .AddAzureOpenTelemetry(configuration)
            .AddValidatorsFromAssemblyContaining<UploadPlaceRequestDtoValidator>();

        return services;
    }

    private static IServiceCollection AddAzureOpenTelemetry(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration["AzureMonitor:ConnectionString"];

        services
            .AddOpenTelemetry()
            .UseAzureMonitor(o => o.ConnectionString = connectionString);

        return services;
    }

    private static IServiceCollection AddCORS(this IServiceCollection services)
    {
        services.AddCors(options => options.AddPolicy(
                "CorsPolicy",
                builder =>
                {
                    builder.AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials()
                           .SetIsOriginAllowed((host) => true);
                }));

        return services;
    }
}
