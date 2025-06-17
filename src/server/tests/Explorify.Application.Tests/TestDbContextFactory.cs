using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Tests;

public static class TestDbContextFactory
{
    public static FakeDbContext CreateWithSeedData()
    {
        var options = new DbContextOptionsBuilder<FakeDbContext>()
            .UseInMemoryDatabase($"TestDb_{Guid.NewGuid()}")
            .Options;

        var context = new FakeDbContext(options);

        Seed(context);

        return context;
    }

    private static void Seed(FakeDbContext context)
    {
        var userId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var placeId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        context.Places.Add(new Domain.Entities.Place
        {
            Id = placeId,
            UserId = userId,
            Name = "Seeded Place",
            IsApproved = true,
            Reviews = new List<Review>(),
        });

        context.Reviews.Add(new Review
        {
            Id = Guid.NewGuid(),
            PlaceId = placeId,
            UserId = userId,
            Content = "Nice place.",
            Rating = 5
        });

        context.SaveChanges();
    }
}
