using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.Delete;

public record DeleteReviewCommand(
    DeleteReviewRequestDto Model,
    Guid CurrentUserId,
    bool IsCurrUserAdmin) : ICommand;
