namespace Explorify.Application;

public interface IBadgeService
{
    Task<BadgeGrantResult?> GrantFirstPlaceBadgeIfEligibleAsync(Guid userId);

    Task<BadgeGrantResult?> GrantFirstReviewBadgeIfEligibleAsync(Guid userId);

    Task<List<BadgeGrantResult>> GrantPointThresholdBadgesAsync(Guid userId, int userPoints);

    Task<List<BadgeGrantResult>> GrantFollowerMilestoneBadgesAsync(Guid userId, int followerCount);

    Task<BadgeGrantResult?> GrantBadgeAsync(
       Guid userId,
       string badgeName);
}
