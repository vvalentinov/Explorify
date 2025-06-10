using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Unapproved;

public class GetUnapprovedReviewsQueryHandler
    : IQueryHandler<GetUnapprovedReviewsQuery, ReviewsListResponseModel>
{
    private readonly IReviewQueryService _reviewQueryService;

    public GetUnapprovedReviewsQueryHandler(IReviewQueryService reviewQueryService)
    {
        _reviewQueryService = reviewQueryService;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetUnapprovedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        if (request.Model.IsForAdmin && !request.IsCurrUserAdmin)
        {
            var error = new Error(
                "Only admins can access all unapproved reviews.",
                ErrorType.Validation);

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
            new UnapprovedReviewFilter(),
            context);

        return Result.Success(result);
    }
}
