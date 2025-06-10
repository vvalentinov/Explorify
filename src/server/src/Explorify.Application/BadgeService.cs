using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application;

public class BadgeService : IBadgeService
{
    private readonly IRepository _repository;

    public BadgeService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<BadgeGrantResult?> GrantFirstPlaceBadgeIfEligibleAsync(Guid userId)
    {
        return await GrantBadgeIfEligibleAsync(userId, "Place Pioneer", async () =>
        {
            return await _repository
                .AllAsNoTracking<Domain.Entities.Place>()
                .AnyAsync(place => place.UserId == userId && place.IsApproved);
        });
    }

    public async Task<BadgeGrantResult?> GrantFirstReviewBadgeIfEligibleAsync(Guid userId)
    {
        return await GrantBadgeIfEligibleAsync(userId, "Review Rookie", async () =>
        {
            return await _repository
                .AllAsNoTracking<Review>()
                .AnyAsync(review => review.UserId == userId && review.IsApproved);
        });
    }

    public async Task<List<BadgeGrantResult>> GrantPointThresholdBadgesAsync(
        Guid userId,
        int userPoints)
    {
        var thresholds = new (int Points, string Name)[]
        {
            (100, "Rising Star"),
            (500, "Local Legend"),
            (1000, "Explorify Elite")
        };

        var granted = new List<BadgeGrantResult>();

        foreach (var (points, name) in thresholds)
        {
            if (userPoints >= points)
            {
                var result = await GrantBadgeIfEligibleAsync(userId, name, () => Task.FromResult(true));
                if (result is not null)
                {
                    granted.Add(result);
                }
            }
        }

        return granted;
    }

    public async Task<List<BadgeGrantResult>> GrantFollowerMilestoneBadgesAsync(
        Guid userId,
        int followerCount)
    {
        var milestones = new (int Count, string Name)[]
        {
            (1, "First Follower"),
            (50, "Mini Community"),
            (100, "Influencer")
        };

        var granted = new List<BadgeGrantResult>();

        foreach (var (count, name) in milestones)
        {
            if (followerCount >= count)
            {
                var result = await GrantBadgeIfEligibleAsync(userId, name, () => Task.FromResult(true));
                if (result is not null)
                {
                    granted.Add(result);
                }
            }
        }

        return granted;
    }

    public async Task<BadgeGrantResult?> GrantBadgeAsync(
       Guid userId,
       string badgeName)
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

    public async Task<BadgeGrantResult?> GrantBadgeIfEligibleAsync(
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

        if (!isEligible)
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
