using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Review.RevertReview;

public record AdminRevertReviewCommand(
    Guid ReviewId,
    Guid CurrentUserId) : ICommand;
