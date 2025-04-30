using Explorify.Domain.Entities;

using static Explorify.Domain.Constants.CategoryConstants;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder
            .Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(CategoryNameMaxLength);

        builder
            .Property(c => c.SlugifiedName)
            .IsRequired()
            .HasMaxLength(200);

        builder
            .Property(c => c.ImageUrl)
            .IsRequired()
            .HasMaxLength(250);

        builder
            .Property(c => c.Description)
            .IsRequired(false)
            .HasMaxLength(CategoryDescriptionMaxLength);

        builder
            .HasOne(c => c.Parent)
            .WithMany(c => c.Children)
            .HasForeignKey(c => c.ParentId);
    }
}
