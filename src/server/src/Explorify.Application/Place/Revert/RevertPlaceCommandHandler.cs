using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Place.Revert;

public class RevertPlaceCommandHandler
    : ICommandHandler<RevertPlaceCommand>
{
    private readonly IRepository _repository;

    private readonly INotificationService _notificationService;

    public RevertPlaceCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;

        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        RevertPlaceCommand request,
        CancellationToken cancellationToken)
    {
        var placeId = request.PlaceId;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrUserAdmin;

        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var query = _repository
            .All<Domain.Entities.Place>(ignoreQueryFilters: true)
            .Include(x => x.Reviews)
            .Where(x =>
                x.IsDeleted &&
                !x.IsCleaned &&
                x.DeletedOn >= cutoff);

        if (!isCurrUserAdmin)
        {
            query = query.Where(x => x.UserId == currUserId && !x.IsDeletedByAdmin);
        }

        var place = await query.FirstOrDefaultAsync(x => x.Id == placeId, cancellationToken);

        if (place == null)
        {
            var error = new Error("No place found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.IsApproved = false;
        place.IsDeleted = false;
        place.DeletedOn = null;

        foreach (var review in place.Reviews)
        {
            review.IsDeleted = false;
            review.DeletedOn = null;
        }

        _repository.Update(place);

        if (isCurrUserAdmin && place.UserId != currUserId)
        {
            var notification = new Domain.Entities.Notification
            {
                ReceiverId = place.UserId,
                SenderId = currUserId,
                Content = $"Your place '{place.Name}' was reverted by admin and is now pending approval!"
            };

            await _repository.AddAsync(notification);
        }

        await _repository.SaveChangesAsync();

        if (isCurrUserAdmin && place.UserId != currUserId)
        {
            await _notificationService.NotifyAsync(
                "Admin reverted a place of yours! Check your notifications.",
                place.UserId);
        }

        return Result.Success("Successfully reverted deleted place!");
    }
}
