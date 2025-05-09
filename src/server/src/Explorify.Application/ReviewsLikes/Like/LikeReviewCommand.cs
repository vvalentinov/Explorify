using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.ReviewsLikes.Like;

public record LikeReviewCommand(Guid ReviewId, Guid UserId)
    : ICommand<ReviewLikesResponseModel>;
