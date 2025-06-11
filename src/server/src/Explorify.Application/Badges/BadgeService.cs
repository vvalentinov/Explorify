using System.Data;

using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.BadgesConstants;

using Dapper;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Badges;

public class BadgeService : IBadgeService
{
    private readonly IRepository _repository;
    private readonly IDbConnection _dbConnection;

    public BadgeService(
        IRepository repository,
        IDbConnection dbConnection)
    {
        _repository = repository;
        _dbConnection = dbConnection;
    }

    public async Task<BadgeGrantResult?> TryGrantFirstPlaceBadgeAsync(Guid userId)
    {
        return await TryGrantBadgeIfEligibleAsync(
            userId,
            PlacePioneerBadge,
            async () =>
            {
                return await _repository
                    .AllAsNoTracking<Domain.Entities.Place>()
                    .AnyAsync(place => place.UserId == userId && place.IsApproved);
            });
    }

    public async Task<BadgeGrantResult?> TryGrantFirstReviewBadgeAsync(Guid userId)
    {
        return await TryGrantBadgeIfEligibleAsync(
            userId,
            ReviewRookieBadge,
            async () =>
            {
                return await _repository
                    .AllAsNoTracking<Review>()
                    .AnyAsync(review => review.UserId == userId && review.IsApproved);
            });
    }

    public async Task<List<BadgeGrantResult>> TryGrantPointThresholdBadgesAsync(Guid userId)
    {
        var thresholds = new (int Points, string Name)[]
        {
            (100, RisingStarBadge),
            (500, LocalLegendBadge),
            (1000, ExplorifyEliteBadge)
        };

        var granted = new List<BadgeGrantResult>();

        const string sql = @"
            SELECT
                Points 
            FROM AspNetUsers 
            WHERE Id = @UserId";

        var parameters = new { UserId = userId };

        var userPoints = await _dbConnection.ExecuteScalarAsync<int>(sql, parameters);

        foreach (var (points, name) in thresholds)
        {
            if (userPoints >= points)
            {
                var result = await TryGrantBadgeIfEligibleAsync(
                    userId,
                    name,
                    () => Task.FromResult(true));

                if (result is not null)
                {
                    granted.Add(result);
                }
            }
        }

        return granted;
    }

    public async Task<List<BadgeGrantResult>> TryGrantFollowerMilestoneBadgesAsync(Guid userId)
    {
        var milestones = new (int Count, string Name)[]
        {
            (1, FirstFollowerBadge),
            (50, MiniCommunityBadge),
            (100, InfluencerBadge)
        };

        var granted = new List<BadgeGrantResult>();

        const string sql = @"
                            SELECT
                                COUNT(*) 
                            FROM UserFollows 
                            WHERE FolloweeId = @FolloweeId AND IsDeleted = 0";

        var parameters = new { FolloweeId = userId };

        var followersCount = await _dbConnection.ExecuteScalarAsync<int>(sql, parameters);

        foreach (var (count, name) in milestones)
        {
            if (followersCount >= count)
            {
                var result = await TryGrantBadgeIfEligibleAsync(
                    userId,
                    name,
                    () => Task.FromResult(true));

                if (result is not null)
                {
                    granted.Add(result);
                }
            }
        }

        return granted;
    }

    private async Task<BadgeGrantResult?> TryGrantBadgeIfEligibleAsync(
        Guid userId,
        string badgeName,
        Func<Task<bool>> eligibilityCheck)
    {
        var badge = await _repository
            .AllAsNoTracking<Badge>()
            .FirstOrDefaultAsync(b => b.Name == badgeName);

        if (badge is null)
        {
            return null;
        }

        var hasAlready = await _repository
            .AllAsNoTracking<UserBadge>()
            .AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badge.Id);

        if (hasAlready)
        {
            return null;
        }

        var isEligible = await eligibilityCheck();

        if (isEligible is false)
        {
            return null;
        }

        var userBadge = new UserBadge
        {
            UserId = userId,
            BadgeId = badge.Id,
            EarnedOn = DateTime.UtcNow
        };

        await _repository.AddAsync(userBadge);

        return new BadgeGrantResult
        {
            BadgeId = badge.Id,
            BadgeName = badge.Name,
        };
    }
}
