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
        var review = await GetReviewWithPlaceAsync(
            request.Model.ReviewId,
            cancellationToken);

        if (review is null)
        {
            var error = new Error("No review with given id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.IsApproved is false)
        {
            var error = new Error("This review is already unapproved!", ErrorType.Validation);
            return Result.Failure(error);
        }

        review.Unapprove();

        var pointResult = await _userService.DecreaseUserPointsAsync(
            review.UserId,
            UserReviewUploadPoints);

        if (pointResult.IsFailure)
        {
            return pointResult;
        }

        await HandleNotificationIfNeededAsync(review, request);

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully unapproved review!");
    }

    private async Task<Domain.Entities.Review?> GetReviewWithPlaceAsync(
        Guid reviewId,
        CancellationToken ct)
    {
        return await _repository
            .All<Domain.Entities.Review>()
            .Include(r => r.Place)
            .FirstOrDefaultAsync(r => r.Id == reviewId, ct);
    }

    private async Task HandleNotificationIfNeededAsync(Domain.Entities.Review review, UnapproveReviewCommand request)
    {
        if (review.UserId == request.CurrentUserId)
        {
            return;
        }

        var notification = new Domain.Entities.Notification
        {
            ReceiverId = review.UserId,
            SenderId = request.CurrentUserId,
            Content = $"Sad news! Your review for the place \"{review.Place.Name}\" was unapproved by an admin. Reason: {request.Model.Reason}."
        };

        await _repository.AddAsync(notification);

        await _notificationService.NotifyAsync(
            "Admin unapproved one of your reviews! Check your notifications.",
            review.UserId);
    }
}
