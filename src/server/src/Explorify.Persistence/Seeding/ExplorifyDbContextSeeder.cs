using Explorify.Persistence.Seeding.Seeders;
using Microsoft.Extensions.Configuration;

namespace Explorify.Persistence.Seeding;

public class ExplorifyDbContextSeeder : ISeeder
{
    private readonly IConfiguration _configuration;

    public ExplorifyDbContextSeeder(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        ArgumentNullException.ThrowIfNull(dbContext);

        IEnumerable<ISeeder> seeders = [
            new RolesSeeder(),
            new CategoriesSeeder(_configuration),
            new CountriesSeeder(),
        ];

        foreach (var seeder in seeders)
        {
            await seeder.SeedAsync(dbContext, serviceProvider);
        }

        await dbContext.SaveChangesAsync();
    }
}
