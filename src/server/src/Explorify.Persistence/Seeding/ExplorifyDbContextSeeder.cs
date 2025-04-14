namespace Explorify.Persistence.Seeding;

public class ExplorifyDbContextSeeder : ISeeder
{
    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        ArgumentNullException.ThrowIfNull(dbContext);

        IEnumerable<ISeeder> seeders = [];

        foreach (var seeder in seeders)
        {
            await seeder.SeedAsync(dbContext, serviceProvider);
        }

        await dbContext.SaveChangesAsync();
    }
}
