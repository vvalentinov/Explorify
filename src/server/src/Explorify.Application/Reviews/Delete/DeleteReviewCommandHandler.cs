using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.Delete;

public class DeleteReviewCommandHandler
    : ICommandHandler<DeleteReviewCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public DeleteReviewCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        DeleteReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.Model.ReviewId;
        var reason = request.Model.Reason;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrUserAdmin;

        var review = await _repository
            .All<Review>()
            .Include(x => x.Place)
            .FirstOrDefaultAsync(x =>
                x.Id == reviewId,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.UserId != currUserId && !isCurrUserAdmin)
        {
            var error = new Error("Only review owner or admin can delete review!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.Place.UserId == currUserId)
        {
            var error = new Error("You cannot delete the review for your own place!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (isCurrUserAdmin &&
            review.UserId != currUserId &&
            string.IsNullOrWhiteSpace(reason))
        {
            var error = new Error("Admin must provide a reason when deleting someone else's review!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (isCurrUserAdmin && review.UserId != currUserId)
        {
            review.IsDeletedByAdmin = true;
        }

        if (review.IsApproved)
        {
            review.IsApproved = false;

            await _userService.DecreaseUserPointsAsync(
                review.UserId.ToString(),
                UserReviewUploadPoints);
        }

        _repository.SoftDelete(review);

        if (review.UserId == currUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success("Successfully deleted review!");
        }

        var notification = new Domain.Entities.Notification
        {
            SenderId = currUserId,
            ReceiverId = review.UserId,
            Content = $"Sad news! Your review for place: '{review.Place.Name}' was deleted by admin! Reason: {reason}.",
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        if (isCurrUserAdmin && review.UserId != currUserId)
        {
            await _notificationService.NotifyAsync(
                "One of your reviews was deleted by admin! Check your notifications.",
                review.UserId);
        }

        return Result.Success("Successfully deleted review!");
    }
}
