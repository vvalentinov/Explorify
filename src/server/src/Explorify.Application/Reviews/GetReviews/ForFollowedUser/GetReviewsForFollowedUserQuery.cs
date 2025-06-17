using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.ForFollowedUser;

public record GetReviewsForFollowedUserQuery(
    Guid CurrentUserId,
    Guid FollowingUserId,
    int Page,
    OrderEnum Order,
    IEnumerable<int> StarsFilter
) : IQuery<ReviewsListResponseModel>;
