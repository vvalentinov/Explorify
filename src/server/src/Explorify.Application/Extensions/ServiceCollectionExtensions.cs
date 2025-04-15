namespace Explorify.Application.Extensions;

using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(ServiceCollectionExtensions).Assembly;

        services
            .AddMediatR(config => config.RegisterServicesFromAssembly(assembly))
            .AddValidatorsFromAssembly(assembly);

        return services;
    }
}
