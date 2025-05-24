using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Review.ApproveReview;

public record ApproveReviewCommand(
    Guid ReviewId,
    Guid CurrentUserId) : ICommand;
