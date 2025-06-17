using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Tests;

public class FakeDbContext : DbContext
{
    public FakeDbContext(DbContextOptions<FakeDbContext> options)
        : base(options) { }

    public DbSet<Domain.Entities.Place> Places
        => Set<Domain.Entities.Place>();

    public DbSet<Review> Reviews => Set<Review>();

    public DbSet<FavoritePlace> FavoritePlaces => Set<FavoritePlace>();

    public DbSet<Domain.Entities.Notification> Notifications
        => Set<Domain.Entities.Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<FavoritePlace>()
            .HasKey(fp => new { fp.UserId, fp.PlaceId });

        modelBuilder.Entity<PlaceVibeAssignment>()
            .HasKey(pv => new { pv.PlaceId, pv.PlaceVibeId });

        modelBuilder.Entity<Domain.Entities.ReviewsLikes>()
            .HasKey(rl => new { rl.ReviewId, rl.UserId });
    }
}
