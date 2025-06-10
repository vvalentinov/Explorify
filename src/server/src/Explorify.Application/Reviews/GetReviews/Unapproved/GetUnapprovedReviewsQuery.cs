using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Unapproved;

public record GetUnapprovedReviewsQuery(
    Guid CurrentUserId,
    bool IsCurrUserAdmin,
    ModeratedReviewsRequestDto Model) : IQuery<ReviewsListResponseModel>;
