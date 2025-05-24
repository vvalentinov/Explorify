using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;
using Explorify.Domain.Entities;

namespace Explorify.Application.Admin.Review.RevertReview;

public class AdminRevertReviewCommandHandler
    : ICommandHandler<AdminRevertReviewCommand>
{
    private readonly IRepository _repository;
    private readonly INotificationService _notificationService;

    public AdminRevertReviewCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        AdminRevertReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.ReviewId;
        var currUserId = request.CurrentUserId;

        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var review = await _repository
            .All<Domain.Entities.Review>(ignoreQueryFilters: true)
            .Include(x => x.Place)
            .Where(x =>
                x.IsDeleted &&
                !x.Place.IsDeleted &&
                x.DeletedOn >= cutoff)
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

        _repository.Update(review);

        if (review.UserId == currUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success("Successfully reverterd review!");
        }

        var notification = new Notification
        {
            ReceiverId = review.UserId,
            SenderId = currUserId,
            Content = $"Good news! Your review for place: {review.Place} was reverted by admin! It is now pending approval. Stay tuned.",
        };

        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync(
            "Admin reverted one of your deleted reviews! Check your notifications.",
            review.UserId);

        return Result.Success("Successfully reverterd review!");
    }
}
