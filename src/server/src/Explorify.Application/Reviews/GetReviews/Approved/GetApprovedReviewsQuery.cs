using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Approved;

public record GetApprovedReviewsQuery(
    Guid CurrentUserId,
    bool IsCurrUserAdmin,
    ModeratedReviewsRequestDto Model) : IQuery<ReviewsListResponseModel>;
