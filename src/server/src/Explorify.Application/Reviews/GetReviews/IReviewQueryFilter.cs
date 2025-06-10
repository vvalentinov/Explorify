using Dapper;

namespace Explorify.Application.Reviews.GetReviews;

public interface IReviewQueryFilter
{
    string GetWhereClause();

    DynamicParameters GetParameters(ReviewQueryContext context);
}
