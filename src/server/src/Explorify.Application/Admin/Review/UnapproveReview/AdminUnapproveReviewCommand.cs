using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Review.UnapproveReview;

public record AdminUnapproveReviewCommand(
    AdminUnapproveReviewDto Model,
    Guid CurrentUserId) : ICommand;
