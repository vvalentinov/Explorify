using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetReviews.GetUnapproved;

public record GetUnapprovedUserReviewsQuery(
    Guid CurrentUserId,
    int Page) : IQuery<UserReviewsListResponseModel>;
