namespace Explorify.Application.Badges;

public interface IBadgeService
{
    Task<BadgeGrantResult?> TryGrantFirstPlaceBadgeAsync(Guid userId);

    Task<BadgeGrantResult?> TryGrantFirstReviewBadgeAsync(Guid userId);

    Task<List<BadgeGrantResult>> TryGrantPointThresholdBadgesAsync(Guid userId);

    Task<List<BadgeGrantResult>> TryGrantFollowerMilestoneBadgesAsync(Guid userId);
}
