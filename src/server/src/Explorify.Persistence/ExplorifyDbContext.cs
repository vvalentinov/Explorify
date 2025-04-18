﻿using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;
using Explorify.Domain.Abstractions.Contracts;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Explorify.Persistence;

public class ExplorifyDbContext :
    IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public ExplorifyDbContext(DbContextOptions<ExplorifyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }

    public DbSet<Country> Countries { get; set; }

    public DbSet<FavoritePlace> FavoritePlaces { get; set; }

    public DbSet<Place> Places { get; set; }

    public DbSet<PlacePhoto> PlacePhotos { get; set; }

    public DbSet<Review> Reviews { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(ExplorifyDbContext).Assembly);

        var entityTypes = builder.Model.GetEntityTypes();

        var foreignKeys = entityTypes
                .SelectMany(x => x.GetForeignKeys())
                .Where(x => x.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var foreignKey in foreignKeys)
        {
            foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
        }

        base.OnModelCreating(builder);
    }

    public override int SaveChanges() => SaveChanges(true);

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        ApplyAuditInfoRules();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => SaveChangesAsync(true, cancellationToken);

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        ApplyAuditInfoRules();

        return base.SaveChangesAsync(
            acceptAllChangesOnSuccess,
            cancellationToken);
    }

    private void ApplyAuditInfoRules()
    {
        var changedEntries = ChangeTracker
            .Entries()
            .Where(x => x.Entity is IAuditInfo && (
                        x.State == EntityState.Added ||
                        x.State == EntityState.Modified));

        foreach (var entry in changedEntries)
        {
            var entity = (IAuditInfo)entry.Entity;

            if (entry.State == EntityState.Added &&
                entity.CreatedOn == default)
            {
                entity.CreatedOn = DateTime.UtcNow;
            }
            else
            {
                entity.ModifiedOn = DateTime.UtcNow;
            }
        }
    }
}
