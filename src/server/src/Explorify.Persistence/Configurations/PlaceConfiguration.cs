﻿using Explorify.Domain.Entities;
using Explorify.Persistence.Identity;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Explorify.Persistence.Configurations;

public class PlaceConfiguration : IEntityTypeConfiguration<Place>
{
    public void Configure(EntityTypeBuilder<Place> builder)
    {
        builder
            .Property(p => p.Name)
            .HasMaxLength(PlaceNameMaxLength)
            .IsRequired();

        builder
            .Property(p => p.SlugifiedName)
            .HasMaxLength(200)
            .IsRequired();

        builder
            .Property(p => p.Description)
            .HasMaxLength(PlaceDescriptionMaxLength)
            .IsRequired();

        builder.HasQueryFilter(x => !x.IsDeleted && !x.IsCleaned);

        builder
            .Property(x => x.ThumbUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder
            .Property(x => x.Address)
            .IsRequired(false)
            .HasMaxLength(300);

        builder
            .Property(p => p.Latitude)
            .IsRequired(false)
            .HasColumnType("decimal(9, 7)");

        builder
            .Property(p => p.Longitude)
            .IsRequired(false)
            .HasColumnType("decimal(10, 7)");

        builder
            .HasOne<ApplicationUser>()
            .WithMany(u => u.Places)
            .HasForeignKey(p => p.UserId);
    }
}
