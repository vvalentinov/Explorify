using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.ForFollowedUser;

public class GetReviewsForFollowedUserQueryHandler
    : IQueryHandler<GetReviewsForFollowedUserQuery, ReviewsListResponseModel>
{
    private readonly IReviewQueryService _reviewQueryService;

    public GetReviewsForFollowedUserQueryHandler(IReviewQueryService reviewQueryService)
    {
        _reviewQueryService = reviewQueryService;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetReviewsForFollowedUserQuery request,
        CancellationToken cancellationToken)
    {
        var context = new ReviewQueryContext
        {
            CurrentUserId = request.CurrentUserId,
            Page = request.Page,
            Order = request.Order,
            StarsFilter = request.StarsFilter ?? []
        };

        var result = await _reviewQueryService.QueryReviewsAsync(
            new FollowedUserReviewFilter(request.FollowingUserId),
            context);

        return Result.Success(result);
    }
}
