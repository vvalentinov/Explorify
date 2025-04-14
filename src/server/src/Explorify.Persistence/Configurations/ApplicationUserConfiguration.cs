using Explorify.Persistence.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(x => x.Id).HasColumnOrder(0);
        builder.Property(x => x.UserName).HasColumnOrder(1).IsRequired();
        builder.Property(x => x.NormalizedUserName).HasColumnOrder(2).IsRequired();
        builder.Property(x => x.Email).HasColumnOrder(3);
        builder.Property(x => x.NormalizedEmail).HasColumnOrder(4);
        builder.Property(x => x.EmailConfirmed).HasColumnOrder(5);
        builder.Property(x => x.PasswordHash).HasColumnOrder(6);
        builder.Property(x => x.SecurityStamp).IsRequired().HasColumnOrder(7);
        builder.Property(x => x.ConcurrencyStamp).IsRequired().HasColumnOrder(8);
        builder.Property(x => x.PhoneNumber).HasColumnOrder(9);
        builder.Property(x => x.PhoneNumberConfirmed).HasColumnOrder(10);
        builder.Property(x => x.TwoFactorEnabled).HasColumnOrder(11);
        builder.Property(x => x.LockoutEnd).HasColumnOrder(12);
        builder.Property(x => x.LockoutEnabled).HasColumnOrder(13);
        builder.Property(x => x.AccessFailedCount).HasColumnOrder(14);
        builder.Property(x => x.CreatedOn).HasColumnOrder(15);
        builder.Property(x => x.ModifiedOn).HasColumnOrder(16);
    }
}
