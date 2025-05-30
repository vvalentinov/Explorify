using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class UserFollowConfiguration
    : IEntityTypeConfiguration<UserFollow>
{
    public void Configure(EntityTypeBuilder<UserFollow> builder)
    {
        builder.HasKey(uf => new { uf.FollowerId, uf.FolloweeId });

        builder
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(uf => uf.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(uf => uf.FolloweeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
