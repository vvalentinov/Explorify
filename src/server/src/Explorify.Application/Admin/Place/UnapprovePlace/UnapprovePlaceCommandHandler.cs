using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Place.UnapprovePlace;

public class UnapprovePlaceCommandHandler
    : ICommandHandler<UnapprovePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public UnapprovePlaceCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        UnapprovePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await LoadPlaceWithReviewsAsync(request.Model.PlaceId, cancellationToken);

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (!place.IsApproved)
        {
            var error = new Error("This place is already unapproved!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.Unapprove();

        var pointsResult = await _userService.DecreaseUserPointsAsync(
            place.UserId,
            UserPlaceUploadPoints);

        if (pointsResult.IsFailure)
        {
            return pointsResult;
        }

        var isByAdmin = IsActionByAdmin(place.UserId, request.CurrentUserId);

        if (isByAdmin)
        {
            if (string.IsNullOrWhiteSpace(request.Model.Reason))
            {
                var error = new Error("Reason for unapproving is required!", ErrorType.Validation);
                return Result.Failure(error);
            }

            await QueueAdminNotificationAsync(place, request.CurrentUserId, request.Model.Reason);
        }

        await _repository.SaveChangesAsync();

        if (isByAdmin)
        {
            await _notificationService.NotifyAsync(
                "Admin unapproved one of your places! Check your notifications.",
                place.UserId);
        }

        return Result.Success("Successfully unapproved place!");
    }

    private async Task<Domain.Entities.Place?> LoadPlaceWithReviewsAsync(Guid placeId, CancellationToken ct)
    {
        return await _repository
            .All<Domain.Entities.Place>()
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x => x.Id == placeId, ct);
    }

    private static bool IsActionByAdmin(Guid placeOwnerId, Guid currentUserId)
       => placeOwnerId != currentUserId;

    private async Task QueueAdminNotificationAsync(Domain.Entities.Place place, Guid adminId, string reason)
    {
        var notification = new Domain.Entities.Notification
        {
            ReceiverId = place.UserId,
            SenderId = adminId,
            Content = $"Sad news! Your place \"{place.Name}\" was unapproved by an admin. Reason: {reason}."
        };

        await _repository.AddAsync(notification);
    }
}
