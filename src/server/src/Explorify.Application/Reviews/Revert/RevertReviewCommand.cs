using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.Revert;

public record RevertReviewCommand(
    Guid ReviewId,
    Guid CurrentUserId,
    bool IsCurrentUserAdmin) : ICommand;
