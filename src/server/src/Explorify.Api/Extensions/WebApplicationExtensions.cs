using Explorify.Persistence;
using Explorify.Persistence.Seeding;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Explorify.Api.Extensions;

public static class WebApplicationExtensions
{
    public static void ConfigureMiddlewarePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app
                .UseSwagger()
                .UseSwaggerUI();
        }

        app
            .UseHttpsRedirection()
            .UseCors("CorsPolicy")
            .UseAuthentication()
            .UseAuthorization();

        app.MapControllers();
    }

    public static async Task SeedDatabaseAsync(this WebApplication app)
    {
        using AsyncServiceScope serviceScope = app.Services.CreateAsyncScope();

        var dbContext = serviceScope
            .ServiceProvider
            .GetRequiredService<ExplorifyDbContext>();

        var slugGenerator = serviceScope
            .ServiceProvider
            .GetRequiredService<ISlugGenerator>();

        bool dbExists = dbContext
            .Database
            .GetService<IRelationalDatabaseCreator>()
            .Exists();

        if (dbExists)
        {
            var dbContextSeeder = new ExplorifyDbContextSeeder(slugGenerator);
            await dbContextSeeder.SeedAsync(dbContext, app.Services);
        }
    }
}
