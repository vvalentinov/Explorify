using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.ForPlace;

public class GetReviewsForPlaceQueryHandler
    : IQueryHandler<GetReviewsForPlaceQuery, ReviewsListResponseModel>
{
    private readonly IReviewQueryService _reviewQueryService;

    public GetReviewsForPlaceQueryHandler(IReviewQueryService reviewQueryService)
    {
        _reviewQueryService = reviewQueryService;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetReviewsForPlaceQuery request,
        CancellationToken cancellationToken)
    {
        var context = new ReviewQueryContext
        {
            PlaceId = request.Model.PlaceId,
            Page = request.Model.Page,
            Order = request.Model.Order,
            StarsFilter = request.Model.StarsFilter ?? [],
            CurrentUserId = request.CurrentUserId,
            IsAdmin = false
        };

        var result = await _reviewQueryService.QueryReviewsAsync(
            new PlaceReviewFilter(),
            context,
            includeLikeStatus: true);

        return Result.Success(result);
    }
}
