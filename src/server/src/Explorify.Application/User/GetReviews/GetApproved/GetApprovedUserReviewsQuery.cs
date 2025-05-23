using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetReviews.GetApproved;

public record GetApprovedUserReviewsQuery(
    Guid CurrentUserId,
    int Page) : IQuery<UserReviewsListResponseModel>;
