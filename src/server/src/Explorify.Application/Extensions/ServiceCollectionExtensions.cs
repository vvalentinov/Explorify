using System.Data;
using Explorify.Application.Place.Upload;

using FluentValidation;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Explorify.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(UploadPlaceRequestModel).Assembly;

        services
            .AddMediatR(config => config.RegisterServicesFromAssembly(assembly))
            .AddValidatorsFromAssembly(assembly);

        services.AddScoped<IDbConnection>(sp =>
        {
            var configuration = sp.GetRequiredService<IConfiguration>();
            var connectionString = configuration.GetConnectionString("DbConnection");
            return new SqlConnection(connectionString);
        });

        return services;
    }
}
