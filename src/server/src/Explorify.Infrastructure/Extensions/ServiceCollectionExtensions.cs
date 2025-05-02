using System.Text;
using Explorify.Persistence;
using Explorify.Persistence.Identity;
using Explorify.Application.Identity;
using Explorify.Infrastructure.Settings;
using Explorify.Infrastructure.Services;
using Explorify.Application.Abstractions.Email;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.AspNetCore.Identity;
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
            .AddIdentity()
            .ConfigureSettings(configuration)
            .AddTransient<ITokenService, TokenService>()
            .AddScoped<IIdentityService, IdentityService>()
            .AddScoped<IBlobService, BlobService>()
            .AddScoped<ISlugGenerator, SlugGenerator>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<IEmailSender, SendGridEmailSender>()
            .AddJwtAuthentication(configuration);

        return services;
    }

    private static IServiceCollection AddIdentity(this IServiceCollection services)
    {
        services
            .AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<ExplorifyDbContext>()
            .AddDefaultTokenProviders();

        return services;
    }

    private static IServiceCollection ConfigureSettings(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .Configure<JwtSettings>(configuration.GetSection(nameof(JwtSettings)))
            .Configure<AzureStorageSettings>(configuration.GetSection(nameof(AzureStorageSettings)));

        return services;
    }

    private static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            IConfiguration configuration)
    {
        var jwtSettingsConfigSection = configuration.GetSection(nameof(JwtSettings));

        var jwtSettings = jwtSettingsConfigSection.Get<JwtSettings>() ??
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
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidateLifetime = true,
                    ValidateAudience = true,
                    ValidAudience = jwtSettings.Audience,
                    ClockSkew = TimeSpan.Zero,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(signKey),
                    TokenDecryptionKey = new SymmetricSecurityKey(encryptKey),
                };
            });

        return services;
    }
}
