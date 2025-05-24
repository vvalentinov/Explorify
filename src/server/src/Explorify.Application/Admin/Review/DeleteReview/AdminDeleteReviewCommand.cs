using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Review.DeleteReview;

public record AdminDeleteReviewCommand(
    AdminDeleteReviewRequestDto Model,
    Guid CurrentUserId) : ICommand;
