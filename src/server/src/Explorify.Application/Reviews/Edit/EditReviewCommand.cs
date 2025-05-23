using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.Edit;

public record EditReviewCommand(
    EditReviewRequestModel Model,
    Guid CurrentUserId) : ICommand;
