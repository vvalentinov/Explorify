using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class PlacePhotoConfiguration : IEntityTypeConfiguration<PlacePhoto>
{
    public void Configure(EntityTypeBuilder<PlacePhoto> builder)
    {
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder.HasQueryFilter(x => x.Place.IsDeleted == false);
    }
}
