using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class BadgeConfiguration
    : IEntityTypeConfiguration<Badge>
{
    public void Configure(EntityTypeBuilder<Badge> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(b => b.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasQueryFilter(b => !b.IsDeleted);
    }
}
