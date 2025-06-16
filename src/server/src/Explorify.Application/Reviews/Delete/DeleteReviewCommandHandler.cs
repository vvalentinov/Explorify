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
        var review = await GetReviewWithPlaceAsync(
            request.Model.ReviewId,
            cancellationToken);

        if (review is null)
        {
            var error = new Error("No review found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var validationResult = ValidateReviewAccess(request, review);

        if (validationResult.IsFailure)
        {
            return validationResult;
        }

        if (request.IsCurrUserAdmin && review.UserId != request.CurrentUserId)
        {
            review.MarkAsDeletedByAdmin();
        }

        if (review.IsApproved)
        {
            var pointsResult = await _userService.DecreaseUserPointsAsync(
                review.UserId,
                UserReviewUploadPoints);

            if (pointsResult.IsFailure)
            {
                return pointsResult;
            }
        }

        _repository.SoftDelete(review);

        if (review.UserId != request.CurrentUserId && request.IsCurrUserAdmin)
        {
            await NotifyReviewDeletionByAdminAsync(request, review);
        }

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully deleted review!");
    }

    private async Task<Review?> GetReviewWithPlaceAsync(Guid reviewId, CancellationToken ct)
    {
        return await _repository
            .All<Review>()
            .Include(r => r.Place)
            .FirstOrDefaultAsync(r => r.Id == reviewId, ct);
    }

    private static Result ValidateReviewAccess(DeleteReviewCommand request, Review review)
    {
        if (review.UserId != request.CurrentUserId && !request.IsCurrUserAdmin)
        {
            var error = new Error("Only the review owner or admin can delete this review!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.Place.UserId == request.CurrentUserId)
        {
            var error = new Error("You cannot delete a review for your own place!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (request.IsCurrUserAdmin && review.UserId != request.CurrentUserId && string.IsNullOrWhiteSpace(request.Model.Reason))
        {
            var error = new Error("Admin must provide a reason when deleting someone else's review!", ErrorType.Validation);
            return Result.Failure(error);
        }

        return Result.Success();
    }

    private async Task NotifyReviewDeletionByAdminAsync(
        DeleteReviewCommand request,
        Review review)
    {
        var notification = new Domain.Entities.Notification
        {
            SenderId = request.CurrentUserId,
            ReceiverId = review.UserId,
            Content = $"Sad news! Your review for place: '{review.Place.Name}' was deleted by admin! Reason: {request.Model.Reason}."
        };

        await _repository.AddAsync(notification);

        await _notificationService.NotifyAsync(
            "One of your reviews was deleted by admin! Check your notifications.",
            review.UserId);
    }
}
