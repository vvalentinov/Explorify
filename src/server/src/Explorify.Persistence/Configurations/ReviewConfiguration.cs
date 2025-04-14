using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;

using static Explorify.Domain.Constants.ReviewConstants;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder.HasQueryFilter(x => x.Place.IsDeleted == false);

        builder
            .Property(r => r.Content)
            .HasMaxLength(ReviewContentMaxLength)
            .IsRequired();

        builder
            .HasOne<ApplicationUser>()
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId);
    }
}
