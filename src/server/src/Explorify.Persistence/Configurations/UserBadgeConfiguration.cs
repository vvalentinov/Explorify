using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class UserBadgeConfiguration
    : IEntityTypeConfiguration<UserBadge>
{
    public void Configure(EntityTypeBuilder<UserBadge> builder)
    {
        builder.HasKey(ub => new { ub.UserId, ub.BadgeId });

        builder.HasQueryFilter(x => !x.Badge.IsDeleted);

        builder.Property(ub => ub.EarnedOn).IsRequired();

        builder.HasOne(ub => ub.Badge)
            .WithMany()
            .HasForeignKey(ub => ub.BadgeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<ApplicationUser>()
            .WithMany(u => u.UserBadges)
            .HasForeignKey(ub => ub.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
