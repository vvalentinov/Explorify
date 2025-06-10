namespace Explorify.Application.Reviews.GetReviews;

public interface IReviewQueryService
{
    Task<ReviewsListResponseModel> QueryReviewsAsync(
        IReviewQueryFilter filterStrategy,
        ReviewQueryContext context,
        bool includeLikeStatus = false);
}
