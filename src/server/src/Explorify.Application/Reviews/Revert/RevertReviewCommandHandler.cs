using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.Revert;

public class RevertReviewCommandHandler
    : ICommandHandler<RevertReviewCommand>
{
    private readonly IRepository _repository;

    private readonly INotificationService _notificationService;

    public RevertReviewCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;

        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        RevertReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.ReviewId;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrentUserAdmin;

        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var review = await _repository
            .All<Review>(ignoreQueryFilters: true)
            .Include(x => x.Place)
            .Where(x =>
                x.IsDeleted &&
                !x.Place.IsDeleted &&
                x.DeletedOn >= cutoff &&
                (x.UserId == currUserId || isCurrUserAdmin))
            .FirstOrDefaultAsync(
                x => x.Id == reviewId,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review was found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        review.IsApproved = false;
        review.IsDeleted = false;
        review.DeletedOn = null;
        review.IsCleaned = false;

        _repository.Update(review);

        if (review.UserId == currUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success("Successfully reverted review!");
        }

        var notification = new Domain.Entities.Notification
        {
            SenderId = currUserId,
            ReceiverId = review.UserId,
            Content = $"Good news! Your review for place: {review.Place.Name} was reverted by admin! It is now pending approval. Stay tuned.",
        };

        await _repository.AddAsync(notification);

        await _repository.SaveChangesAsync();

        if (isCurrUserAdmin && review.UserId != currUserId)
        {
            await _notificationService.NotifyAsync(
                "Admin reverted one of your deleted reviews! Check your notifications.",
                review.UserId);
        }

        return Result.Success("Successfully reverted review!");
    }
}
