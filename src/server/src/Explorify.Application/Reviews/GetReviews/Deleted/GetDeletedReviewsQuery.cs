using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Deleted;

public record GetDeletedReviewsQuery(
    Guid CurrentUserId,
    bool IsCurrUserAdmin,
    ModeratedReviewsRequestDto Model) : IQuery<ReviewsListResponseModel>;
