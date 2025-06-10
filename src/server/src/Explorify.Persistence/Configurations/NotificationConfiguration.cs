using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class NotificationConfiguration
    : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasQueryFilter(x => !x.IsDeleted);

        builder
            .Property(x => x.Content)
            .IsRequired()
            .HasMaxLength(1000);

        builder
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(n => n.ReceiverId);

        builder
            .HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(n => n.SenderId);
    }
}
