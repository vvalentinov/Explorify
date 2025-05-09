using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class ReviewLikeConfiguration
    : IEntityTypeConfiguration<ReviewsLikes>
{
    public void Configure(EntityTypeBuilder<ReviewsLikes> builder)
    {
        builder.HasKey(rl => new { rl.UserId, rl.ReviewId });

        builder.HasOne(rl => rl.Review)
            .WithMany(r => r.ReviewLikes)
            .HasForeignKey(rl => rl.ReviewId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<ApplicationUser>()
            .WithMany(u => u.ReviewLikes)
            .HasForeignKey(rl => rl.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => x.Review.IsDeleted == false);
    }
}
