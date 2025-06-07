using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Persistence.Seeding.Seeders;

public class BadgesSeeder : ISeeder
{
    private readonly List<Badge> _badges;

    public BadgesSeeder()
    {
        _badges = new List<Badge>
        {
            new Badge()
            {
                Name = "Place Pioneer",
                Description = "Your very first place has been approved! You've officially set foot on the Explorify map, leading the way for others to follow your trail of discovery.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/placePioneer.png"
            },
            new Badge()
            {
                Name = "Review Rookie",
                Description = "You’ve shared your first travel thoughts — a small step for you, a huge leap for the Explorify community. Your voice is now part of the adventure.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/reviewRookie.png"
            },
            new Badge()
            {
                Name = "Rising Star",
                Description = "With 100 points under your belt, your passion for exploration is shining bright. Fellow travelers are taking notice — you're becoming a go-to guide.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/risingStar.png"
            },
            new Badge()
            {
                Name = "Local Legend",
                Description = "500 points! You've built a reputation as someone who uncovers hidden gems and tells unforgettable stories. Explorify thrives because of adventurers like you.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/localLegend.png"
            },
            new Badge()
            {
                Name = "Explorify Elite",
                Description = "You’ve reached 1,000 points — the summit of Explorify excellence. Your contributions have shaped the journey of countless explorers. Wear this crown with pride.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/explorifyElite.png"
            },
            new Badge()
            {
                Name = "First Follower",
                Description = "Someone out there loves your vibe and clicked 'Follow'. You’ve sparked curiosity — your adventures are now being watched and celebrated.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/firstFollower.png"
            },
            new Badge()
            {
                Name = "Mini Community",
                Description = "With 50 followers, you're more than a traveler — you’re a storyteller with an audience. Your adventures are inspiring a growing circle of dreamers.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/miniCommunity.png"
            },
            new Badge()
            {
                Name = "Influencer",
                Description = "You’ve gained 100 followers — you're officially an Explorify Influencer. People look to you for direction, discovery, and inspiration across the globe.",
                ImageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Badges/influencer.png"
            },
        };

    }

    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        if (await dbContext.Badges.AnyAsync())
        {
            return;
        }

        await dbContext.Badges.AddRangeAsync(_badges);
    }
}
