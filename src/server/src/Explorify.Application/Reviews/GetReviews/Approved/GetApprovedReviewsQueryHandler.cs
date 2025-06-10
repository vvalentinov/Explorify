using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Approved;

public class GetApprovedReviewsQueryHandler
    : IQueryHandler<GetApprovedReviewsQuery, ReviewsListResponseModel>
{
    private readonly IReviewQueryService _reviewQueryService;

    public GetApprovedReviewsQueryHandler(IReviewQueryService reviewQueryService)
    {
        _reviewQueryService = reviewQueryService;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetApprovedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        if (request.Model.IsForAdmin && !request.IsCurrUserAdmin)
        {
            var error = new Error("Only admins can access all approved reviews.", ErrorType.Validation);
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
            new ApprovedReviewFilter(),
            context);

        return Result.Success(result);
    }
}
