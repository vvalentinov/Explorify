﻿using Explorify.Persistence.Extensions;
using Explorify.Application.Extensions;
using Explorify.Infrastructure.Extensions;

using FluentValidation;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using Microsoft.AspNetCore.Identity;
using Explorify.Api.DTOs.Validators;

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
            .AddExceptionHandler<GlobalExceptionHandler>()
            .AddProblemDetails();

        services.AddSignalR();

        services.AddHttpClient();

        services.AddMemoryCache();

        services
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
            });

        services.AddValidatorsFromAssemblyContaining<UploadPlaceRequestDtoValidator>();

        return services;
    }

    private static IServiceCollection AddCORS(this IServiceCollection services)
    {
        services.AddCors(options => options.AddPolicy("CorsPolicy",
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
