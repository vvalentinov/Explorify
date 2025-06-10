using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Deleted;

public class GetDeletedReviewsQueryHandler
    : IQueryHandler<GetDeletedReviewsQuery, ReviewsListResponseModel>
{
    private readonly IReviewQueryService _reviewQueryService;

    public GetDeletedReviewsQueryHandler(IReviewQueryService reviewQueryService)
    {
        _reviewQueryService = reviewQueryService;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetDeletedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        if (request.Model.IsForAdmin && !request.IsCurrUserAdmin)
        {
            var error = new Error("Only admins can access all recently deleted reviews.", ErrorType.Validation);
            return Result.Failure<ReviewsListResponseModel>(error);
        }

        var context = new ReviewQueryContext
        {
            CurrentUserId = request.CurrentUserId,
            IsAdmin = request.IsCurrUserAdmin && request.Model.IsForAdmin,
            Page = request.Model.Page,
            StarsFilter = request.Model.StarsFilter ?? [],
            Order = request.Model.Order
        };

        var result = await _reviewQueryService.QueryReviewsAsync(
            new DeletedReviewFilter(),
            context);

        return Result.Success(result);
    }
}
