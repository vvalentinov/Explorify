﻿namespace Explorify.Application.Badges;

public class BadgeDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsUnlocked { get; set; }

    public double ProgressPercentage { get; set; }
}
