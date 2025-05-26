using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Deleted;

public record GetDeletedReviewsQuery(
    Guid CurrentUserId,
    bool IsCurrUserAdmin,
    int Page,
    bool IsForAdmin) : IQuery<ReviewsListResponseModel>;
