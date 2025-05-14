using Explorify.Application.Abstractions.Interfaces;
using Explorify.Persistence.Seeding.Seeders;

namespace Explorify.Persistence.Seeding;

public class ExplorifyDbContextSeeder : ISeeder
{
    private readonly ISlugGenerator _slugGenerator;

    public ExplorifyDbContextSeeder(ISlugGenerator slugGenerator)
    {
        _slugGenerator = slugGenerator;
    }

    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        ArgumentNullException.ThrowIfNull(dbContext);

        IEnumerable<ISeeder> seeders = [
            new RolesSeeder(),
            new CountriesSeeder(),
            new PlaceVibesSeeder(),
            new CategoriesSeeder(_slugGenerator),
        ];

        foreach (var seeder in seeders)
        {
            await seeder.SeedAsync(dbContext, serviceProvider);
        }

        await dbContext.SaveChangesAsync();
    }
}
