using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.Delete;

public record DeleteReviewCommand(
    Guid Reviewid,
    Guid CurrentUserId,
    bool IsCurrUserAdmin) : ICommand;
