using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Review.UnapproveReview;

public record UnapproveReviewCommand(
    UnapproveReviewDto Model,
    Guid CurrentUserId) : ICommand;
