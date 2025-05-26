using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Review.ApproveReview;

public class ApproveReviewCommandHandler
    : ICommandHandler<ApproveReviewCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public ApproveReviewCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        ApproveReviewCommand request,
        CancellationToken cancellationToken)
    {
        var review = await _repository
            .All<Domain.Entities.Review>()
            .Include(x => x.Place)
            .FirstOrDefaultAsync(x =>
                x.Id == request.ReviewId,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review with given id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.IsApproved)
        {
            var error = new Error("This review is already approved!", ErrorType.Validation);
            return Result.Failure(error);
        }

        review.IsApproved = true;

        var increasePointsResult = await _userService.IncreaseUserPointsAsync(
            review.UserId.ToString(),
            UserReviewUploadPoints);

        if (increasePointsResult.IsFailure)
        {
            return increasePointsResult;
        }

        _repository.Update(review);

        if (review.UserId == request.CurrentUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success("Successfully approved review!");
        }

        var notification = new Domain.Entities.Notification
        {
            ReceiverId = review.UserId,
            SenderId = request.CurrentUserId,
            Content = $"Great news! Your review for place \"{review.Place.Name}\" just got the seal of approval. You've earned {UserReviewUploadPoints} adventure points – keep exploring!"
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync(
            "Admin approved your review request! Check your notifications.",
            review.UserId);

        return Result.Success("Successfully approved review!");
    }
}
