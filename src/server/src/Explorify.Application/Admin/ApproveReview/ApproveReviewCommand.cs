using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.ApproveReview;

public record ApproveReviewCommand(Guid ReviewId, Guid CurrentUserId)
    : ICommand;
