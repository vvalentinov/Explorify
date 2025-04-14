using Explorify.Persistence.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class ApplicationRoleConfiguration : IEntityTypeConfiguration<ApplicationRole>
{
    public void Configure(EntityTypeBuilder<ApplicationRole> builder)
    {
        builder.Property(e => e.Id).HasColumnOrder(0);
        builder.Property(e => e.Name).HasColumnOrder(1);
        builder.Property(e => e.NormalizedName).HasColumnOrder(2);
        builder.Property(e => e.ConcurrencyStamp).HasColumnOrder(3);
        builder.Property(e => e.CreatedOn).HasColumnOrder(4);
        builder.Property(e => e.ModifiedOn).HasColumnOrder(5);
        builder.Property(e => e.IsDeleted).HasColumnOrder(6);
        builder.Property(e => e.DeletedOn).HasColumnOrder(7);
    }
}
