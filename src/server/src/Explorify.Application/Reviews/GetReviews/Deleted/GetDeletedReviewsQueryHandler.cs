using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Abstractions.Interfaces;

namespace Explorify.Application.Reviews.GetReviews.Deleted;

public class GetDeletedReviewsQueryHandler
    : IQueryHandler<GetDeletedReviewsQuery, ReviewsListResponseModel>
{
    private readonly IReviewQueryService _reviewQueryService;
    private readonly IEnvironmentService _environmentService;

    public GetDeletedReviewsQueryHandler(
        IReviewQueryService reviewQueryService,
        IEnvironmentService environmentService)
    {
        _reviewQueryService = reviewQueryService;
        _environmentService = environmentService;
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

        var cutoff = _environmentService.GetCurrentEnvironment() == "Development"
            ? DateTime.UtcNow.AddMinutes(-1)
            : DateTime.UtcNow.AddDays(-7);

        var context = new ReviewQueryContext
        {
            CurrentUserId = request.CurrentUserId,
            IsAdmin = request.IsCurrUserAdmin && request.Model.IsForAdmin,
            Page = request.Model.Page,
            StarsFilter = request.Model.StarsFilter ?? [],
            Order = request.Model.Order,
            DeletedCutoff = cutoff
        };

        var result = await _reviewQueryService.QueryReviewsAsync(
            new DeletedReviewFilter(),
            context);

        return Result.Success(result);
    }
}
