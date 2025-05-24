using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Review.DeleteReview;

public class AdminDeleteReviewCommandHandler :
    ICommandHandler<AdminDeleteReviewCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public AdminDeleteReviewCommandHandler(
        IRepository repository,
        INotificationService notificationService,
        IUserService userService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        AdminDeleteReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.Model.ReviewId;
        var reason = request.Model.Reason;
        var currUserId = request.CurrentUserId;

        var review = await _repository
            .All<Domain.Entities.Review>()
            .Include(x => x.Place)
            .Where(x => !x.Place.IsDeleted)
            .FirstOrDefaultAsync(x =>
                x.Id == reviewId,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.SoftDelete(review);

        review.IsDeletedByAdmin = true;

        _repository.Update(review);

        if (review.IsApproved)
        {
            review.IsApproved = false;

            await _userService.DecreaseUserPointsAsync(
                review.UserId.ToString(),
                UserReviewUploadPoints);
        }

        if (review.UserId == currUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success("Successfully deleted review!");
        }

        var notification = new Notification
        {
            ReceiverId = review.UserId,
            SenderId = currUserId,
            Content = $"Sad news! Your review for place: {review.Place.Name} was deleted by admin! Reason: {reason}.",
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync(
            "One of your reviews was deleted by admin! Check your notifications.",
            review.UserId);

        return Result.Success("Successfully deleted review!");
    }
}
