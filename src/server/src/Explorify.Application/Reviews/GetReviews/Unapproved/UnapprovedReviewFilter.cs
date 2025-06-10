using Dapper;

namespace Explorify.Application.Reviews.GetReviews.Unapproved;

public class UnapprovedReviewFilter : IReviewQueryFilter
{
    public DynamicParameters GetParameters(ReviewQueryContext context)
    {
        var stars = context.StarsFilter?.ToList() ?? new List<int>();

        var parameters = new DynamicParameters();

        parameters.Add("CurrentUserId", context.CurrentUserId);
        parameters.Add("IsAdmin", context.IsAdmin);
        parameters.Add("Offset", (context.Page - 1) * context.ItemsPerPage);
        parameters.Add("Take", context.ItemsPerPage);
        parameters.Add("StarsFilter", stars);
        parameters.Add("HasStarsFilter", stars.Count != 0 ? 1 : 0);

        return parameters;
    }

    public string GetWhereClause()
    {
        return """
            WHERE r.IsApproved = 0 AND p.IsDeleted = 0 AND r.IsDeleted = 0
              AND (
                (@IsAdmin = 1 AND r.UserId != p.UserId)
                OR
                (@IsAdmin = 0 AND r.UserId = @CurrentUserId AND p.UserId != @CurrentUserId)
              )
              AND (@HasStarsFilter = 0 OR r.Rating IN @StarsFilter)
            """;
    }
}
