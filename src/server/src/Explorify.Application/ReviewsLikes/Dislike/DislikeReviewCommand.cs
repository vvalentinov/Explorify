using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.ReviewsLikes.Dislike;

public record DislikeReviewCommand(Guid ReviewId, Guid UserId)
    : ICommand<ReviewLikesResponseModel>;
