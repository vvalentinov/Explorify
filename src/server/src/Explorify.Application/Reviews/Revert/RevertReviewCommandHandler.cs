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
    private readonly IUserService _userService;
    private readonly IEnvironmentService _environmentService;

    public RevertReviewCommandHandler(
        IRepository repository,
        INotificationService notificationService,
        IUserService userService,
        IEnvironmentService environmentService)
    {
        _repository = repository;
        _notificationService = notificationService;
        _userService = userService;
        _environmentService = environmentService;
    }

    public async Task<Result> Handle(
        RevertReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.ReviewId;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrentUserAdmin;

        var env = _environmentService.GetCurrentEnvironment();

        var cutoff = env == "Development"
            ? DateTime.UtcNow.AddMinutes(-1)
            : DateTime.UtcNow.AddDays(-7);

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

        if (review is null)
        {
            var error = new Error("No review was found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (!isCurrUserAdmin && review.IsDeletedByAdmin)
        {
            var error = new Error("An administrator deleted this review! You don't have access!", ErrorType.Validation);
            return Result.Failure(error);
        }

        review.IsDeleted = false;
        review.DeletedOn = null;
        review.IsCleaned = false;
        review.IsDeletedByAdmin = false;

        _repository.Update(review);

        if (review.UserId == currUserId)
        {
            await _repository.SaveChangesAsync();

            if (review.IsApproved)
            {
                await _userService.IncreaseUserPointsAsync(review.UserId, 5);
            }

            return Result.Success("Successfully reverted review!");
        }

        var notification = new Domain.Entities.Notification
        {
            SenderId = currUserId,
            ReceiverId = review.UserId,
            Content = $"Good news! Your review for place: {review.Place.Name} was reverted by admin!",
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
