using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Persistence.Seeding.Seeders;

public class PlaceVibesSeeder : ISeeder
{
    private readonly List<PlaceVibe> _vibes;

    public PlaceVibesSeeder()
    {
        _vibes =
             [
                 new() { Name = "Relaxing" },
                 new() { Name = "Romantic" },
                 new() { Name = "Adventurous" },
                 new() { Name = "Peaceful" },
                 new() { Name = "Lively" },
                 new() { Name = "Quiet" },
                 new() { Name = "Charming" },
                 new() { Name = "Vibrant" },
                 new() { Name = "Trendy" },
                 new() { Name = "Nostalgic" },
                 new() { Name = "Wholesome" },
                 new() { Name = "Cozy" },
                 new() { Name = "Mysterious" },
                 new() { Name = "Surreal" },
                 new() { Name = "Dreamy" },
                 new() { Name = "Instagrammable" },
                 new() { Name = "Photogenic" },
                 new() { Name = "Colorful" },
                 new() { Name = "Family-friendly" },
                 new() { Name = "Pet-friendly" },
                 new() { Name = "Tourist hotspot" },
                 new() { Name = "Buzzing" },
                 new() { Name = "Festive" },
                 new() { Name = "Budget-friendly" },
                 new() { Name = "Luxury experience" },
                 new() { Name = "Group-friendly" },
                 new() { Name = "Kid-friendly" },
                 new() { Name = "Easy to reach" },
                 new() { Name = "Remote" },
                 new() { Name = "Chill vibes" },
                 new() { Name = "Fitness-friendly" },
                 new() { Name = "Picnic spot" },
                 new() { Name = "Sunbathing" },
                 new() { Name = "Star gazing" },
                 new() { Name = "Biking" },
                 new() { Name = "Exploring" },
                 new() { Name = "Local interaction" },
                 new() { Name = "Date spot" },
                 new() { Name = "Local hangout" },
                 new() { Name = "Foodie heaven" },
                 new() { Name = "Live music" },
                 new() { Name = "Nightlife" },
                 new() { Name = "Craft beer" },
                 new() { Name = "Wine lovers" },
                 new() { Name = "Dessert spot" },
             ];
    }

    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        if (await dbContext.PlaceVibes.AnyAsync())
        {
            return;
        }

        await dbContext.PlaceVibes.AddRangeAsync(_vibes);
    }
}
