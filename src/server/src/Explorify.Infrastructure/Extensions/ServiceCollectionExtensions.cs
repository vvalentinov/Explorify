using System.Text;

using Explorify.Persistence;
using Explorify.Persistence.Identity;
using Explorify.Application.Identity;
using Explorify.Infrastructure.Settings;
using Explorify.Infrastructure.Services;
using Explorify.Infrastructure.BackgroundJobs;
using Explorify.Application.Abstractions.Email;
using Explorify.Application.Abstractions.Interfaces;

using Quartz;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;

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
            .AddScoped<IImageService, ImageService>()
            .AddScoped<IProfileService, ProfileService>()
            .AddJwtAuthentication(configuration);

        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IGeocodingService, GeocodingService>();
        services.AddScoped<IWeatherInfoService, WeatherInfoService>();

        var env = configuration["ASPNETCORE_ENVIRONMENT"];

        services.AddQuartz(q =>
        {
            //var jobKey = nameof(DeleteExpiredContentJob);

            //q
            //    .AddJob<DeleteExpiredContentJob>(JobKey.Create(jobKey))
            //    .AddTrigger(triggerConfig =>
            //        triggerConfig
            //        .ForJob(jobKey)
            //        .WithSimpleSchedule(x => x.WithIntervalInMinutes(5).RepeatForever()));

            var jobKey = JobKey.Create(nameof(DeleteExpiredContentJob));
            q.AddJob<DeleteExpiredContentJob>(jobKey);

            q.AddTrigger(trigger =>
            {
                trigger.ForJob(jobKey);

                if (env == "Development")
                {
                    trigger.WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever());
                }
                else if (env == "Production")
                {
                    // Midnight daily
                    trigger.WithCronSchedule("0 0 0 * * ?"); 
                }
            });
        });

        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        return services;
    }

    private static IServiceCollection AddIdentity(this IServiceCollection services)
    {
        services
            .AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                // password options
                options.Password.RequiredLength = 6;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;

                options.User.RequireUniqueEmail = true;
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
            .Configure<AzureStorageSettings>(configuration.GetSection(nameof(AzureStorageSettings)))
            .Configure<GeocodingSettings>(configuration.GetSection(nameof(GeocodingSettings)))
            .Configure<WeatherApiSettings>(configuration.GetSection(nameof(WeatherApiSettings)))
            .Configure<SendGridSettings>(configuration.GetSection(nameof(SendGridSettings)));

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
            .AddCookie()
            .AddGoogle(options =>
            {
                var clientId = configuration["Authentication:Google:ClientId"];

                if (clientId == null)
                {
                    throw new ArgumentNullException(nameof(clientId));
                }

                var clientSecret = configuration["Authentication:Google:ClientSecret"];

                if (clientSecret == null)
                {
                    throw new ArgumentNullException(nameof(clientSecret));
                }

                options.ClientId = clientId;
                options.ClientSecret = clientSecret;
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
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

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/api/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };

            });

        return services;
    }
}
