using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Badges;

public class GetUserBadgesQueryHandler
    : IQueryHandler<GetUserBadgesQuery, List<BadgeDto>>
{
    private readonly IDbConnection _dbConnection;

    public GetUserBadgesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<List<BadgeDto>>> Handle(
        GetUserBadgesQuery request,
        CancellationToken cancellationToken)
    {
        var sqlAllBadges = @"
            SELECT
                Id,
                Name,
                Description,
                ImageUrl
            FROM Badges
            WHERE IsDeleted = 0";

        var sqlUserBadges = @"
            SELECT
                BadgeId
            FROM UserBadges
            WHERE UserId = @UserId";

        var allBadges = (await _dbConnection.QueryAsync<BadgeDto>(sqlAllBadges)).ToList();

        var userBadgeIds = (await _dbConnection.QueryAsync<int>(sqlUserBadges, new { request.UserId })).ToHashSet();

        // Fetch dynamic progress inputs (e.g., from aggregate views or direct counts)
        var sqlStats = @"
            SELECT 
                Points,
                (SELECT COUNT(*) FROM UserFollows WHERE FolloweeId = @UserId AND IsDeleted = 0) AS FollowerCount,
                (SELECT COUNT(*) FROM Places WHERE UserId = @UserId AND IsDeleted = 0 AND IsApproved = 1) AS PlaceCount,
                (SELECT COUNT(*) 
                    FROM Reviews r
                    JOIN Places p ON r.PlaceId = p.Id
                    WHERE r.UserId = @UserId 
                    AND r.IsDeleted = 0 
                    AND r.IsApproved = 1 
                    AND p.UserId != @UserId AND p.IsDeleted = 0) AS ReviewCount
            FROM AspNetUsers
            WHERE Id = @UserId";

        var stats = await _dbConnection.QuerySingleOrDefaultAsync<dynamic>(sqlStats, new { request.UserId });

        if (stats is null)
        {
            return Result.Success(new List<BadgeDto>());
        }

        int points = stats.Points;
        int followerCount = stats.FollowerCount;
        int placeCount = stats.PlaceCount;
        int reviewCount = stats.ReviewCount;

        var badgeDtos = allBadges.Select(badge =>
        {
            bool isUnlocked = userBadgeIds.Contains(badge.Id);

            double progress = badge.Name switch
            {
                "Explorify Elite" => Progress(points, 1000),
                "Review Rookie" => Progress(reviewCount, 1),
                "First Follower" => Progress(followerCount, 1),
                "Influencer" => Progress(followerCount, 50),
                "Local Legend" => Progress(points, 500),
                "Mini Community" => Progress(followerCount, 100),
                "Place Pioneer" => Progress(placeCount, 1),
                "Rising Star" => Progress(points, 100),
                _ => 0
            };

            return new BadgeDto
            {
                Id = badge.Id,
                Name = badge.Name,
                Description = badge.Description,
                ImageUrl = badge.ImageUrl,
                IsUnlocked = isUnlocked,
                ProgressPercentage = isUnlocked ? 100 : Math.Round(progress, 2)
            };
        }).ToList();

        return Result.Success(badgeDtos);
    }

    private static double Progress(int current, int target) => Math.Min(100.0 * current / target, 100);
}
