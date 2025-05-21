namespace Explorify.Application.Extensions;

using Explorify.Application.Places.Upload;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(UploadPlaceRequestModel).Assembly;

        services
            .AddMediatR(config => config.RegisterServicesFromAssembly(assembly))
            .AddValidatorsFromAssembly(assembly);

        return services;
    }
}
