using System.Text;
using Explorify.Application;

using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Explorify.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
       this IServiceCollection services,
       IConfiguration configuration)
    {
        services
            .AddTransient<ITokenService, TokenService>()
            .AddJwtAuthentication(configuration);

        return services;
    }

    private static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            IConfiguration configuration)
    {
        IConfigurationSection jwtSettingsConfigSection = configuration
            .GetSection(nameof(JwtSettings));

        services.Configure<JwtSettings>(jwtSettingsConfigSection);

        JwtSettings jwtSettings = jwtSettingsConfigSection.Get<JwtSettings>() ??
            throw new InvalidOperationException("The JwtSettings are missing!");

        var signKey = Encoding.ASCII.GetBytes(jwtSettings.SignKey);
        var encryptKey = Encoding.ASCII.GetBytes(jwtSettings.EncryptKey);

        services
            .AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(signKey),
                    TokenDecryptionKey = new SymmetricSecurityKey(encryptKey),
                };
            });

        return services;
    }
}
