using Dapper;

namespace Explorify.Application.Reviews.GetReviews.ForFollowedUser;

public class FollowedUserReviewFilter : IReviewQueryFilter
{
    private readonly Guid _followingUserId;

    public FollowedUserReviewFilter(Guid followingUserId)
    {
        _followingUserId = followingUserId;
    }

    public DynamicParameters GetParameters(ReviewQueryContext context)
    {
        var stars = context.StarsFilter?.ToList() ?? new();

        var parameters = new DynamicParameters();
        parameters.Add("FollowingUserId", _followingUserId);
        parameters.Add("Offset", (context.Page - 1) * context.ItemsPerPage);
        parameters.Add("Take", context.ItemsPerPage);
        parameters.Add("StarsFilter", stars);
        parameters.Add("HasStarsFilter", stars.Any() ? 1 : 0);

        return parameters;
    }

    public string GetWhereClause()
    {
        return """
            WHERE r.IsApproved = 1 AND r.IsDeleted = 0 AND p.IsDeleted = 0
              AND r.UserId = @FollowingUserId
              AND p.UserId != @FollowingUserId
              AND (@HasStarsFilter = 0 OR r.Rating IN @StarsFilter)
            """;
    }
}
