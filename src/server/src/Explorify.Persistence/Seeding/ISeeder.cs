namespace Explorify.Persistence.Seeding;

public interface ISeeder
{
    Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider);
}
