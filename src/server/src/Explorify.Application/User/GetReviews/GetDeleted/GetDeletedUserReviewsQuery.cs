using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetReviews.GetDeleted;

public record GetDeletedUserReviewsQuery(
    Guid CurrentUserId,
    int Page) : IQuery<UserReviewsListResponseModel>;
