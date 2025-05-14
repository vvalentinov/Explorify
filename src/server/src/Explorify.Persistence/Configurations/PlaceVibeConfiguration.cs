using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class PlaceVibeConfiguration
    : IEntityTypeConfiguration<PlaceVibe>
{
    public void Configure(EntityTypeBuilder<PlaceVibe> builder)
    {
        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
    }
}
