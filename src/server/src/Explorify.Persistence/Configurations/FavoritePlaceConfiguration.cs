using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class FavoritePlaceConfiguration : IEntityTypeConfiguration<FavoritePlace>
{
    public void Configure(EntityTypeBuilder<FavoritePlace> builder)
    {
        builder.HasKey(x => new { x.PlaceId, x.UserId });

        builder.HasQueryFilter(x => x.Place.IsDeleted == false);

        builder
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(fp => fp.UserId);
    }
}
