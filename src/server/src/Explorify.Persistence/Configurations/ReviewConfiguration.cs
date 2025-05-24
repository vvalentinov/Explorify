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
        // builder.HasQueryFilter(x => !x.IsDeleted && !x.Place.IsDeleted && !x.IsCleaned);
        builder.HasQueryFilter(x => !x.IsDeleted && !x.IsCleaned);

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
