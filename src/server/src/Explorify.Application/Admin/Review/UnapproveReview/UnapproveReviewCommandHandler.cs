using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Review.UnapproveReview;

public class UnapproveReviewCommandHandler :
    ICommandHandler<UnapproveReviewCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public UnapproveReviewCommandHandler(
        IRepository repository,
        INotificationService notificationService,
        IUserService userService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        UnapproveReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.Model.ReviewId;
        var reason = request.Model.Reason;
        var currentUserId = request.CurrentUserId;

        var review = await _repository
           .All<Domain.Entities.Review>()
           .Include(x => x.Place)
           .FirstOrDefaultAsync(x =>
               x.Id == reviewId,
               cancellationToken);

        if (review == null)
        {
            var error = new Error("No review with given id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (!review.IsApproved)
        {
            var error = new Error("This review is already unapproved!", ErrorType.Validation);
            return Result.Failure(error);
        }

        review.IsApproved = false;

        var decreaseUserPoints = await _userService.DecreaseUserPointsAsync(
            review.UserId.ToString(),
            UserReviewUploadPoints);

        if (decreaseUserPoints.IsFailure)
        {
            return decreaseUserPoints;
        }

        _repository.Update(review);

        if (review.UserId == request.CurrentUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success("Successfully unapproved review!");
        }

        if (review.UserId != currentUserId)
        {
            var notification = new Domain.Entities.Notification
            {
                ReceiverId = review.UserId,
                SenderId = request.CurrentUserId,
                Content = $"Sad news! Your review for the place \"{review.Place.Name}\" was unapproved by an admin. Reason: {request.Model.Reason}."
            };

            await _repository.AddAsync(notification);
        }

        
        await _repository.SaveChangesAsync();

        if (review.UserId != currentUserId)
        {
            await _notificationService.NotifyAsync(
                "Admin unapproved one of your reviews! Check your notifications.",
                review.UserId);
        }

        return Result.Success("Successfully unapproved review!");
    }
}
