using Dapper;

namespace Explorify.Application.Reviews.GetReviews.ForPlace;

public class PlaceReviewFilter : IReviewQueryFilter
{
    public DynamicParameters GetParameters(ReviewQueryContext context)
    {
        var stars = context.StarsFilter?.ToList() ?? new List<int>();

        var parameters = new DynamicParameters();

        parameters.Add("PlaceId", context.PlaceId);
        parameters.Add("CurrentUserId", context.CurrentUserId);
        parameters.Add("Offset", (context.Page - 1) * context.ItemsPerPage);
        parameters.Add("Take", context.ItemsPerPage);
        parameters.Add("StarsFilter", stars);
        parameters.Add("HasStarsFilter", stars.Count != 0 ? 1 : 0);

        return parameters;
    }

    public string GetWhereClause()
    {
        return """
            WHERE r.PlaceId = @PlaceId
              AND r.IsApproved = 1
              AND r.IsDeleted = 0
              AND r.UserId != (SELECT UserId FROM Places WHERE Id = @PlaceId)
              AND (@HasStarsFilter = 0 OR r.Rating IN @StarsFilter)
            """;
    }
}
