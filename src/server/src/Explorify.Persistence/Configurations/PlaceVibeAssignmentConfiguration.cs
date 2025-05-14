using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class PlaceVibeAssignmentConfiguration
    : IEntityTypeConfiguration<PlaceVibeAssignment>
{
    public void Configure(EntityTypeBuilder<PlaceVibeAssignment> builder)
    {
        builder.HasKey(x => new { x.PlaceId, x.PlaceVibeId });

        builder.HasQueryFilter(x => x.Place.IsDeleted == false);
    }
}
