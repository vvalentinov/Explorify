using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Place.DeletePlace;

public class AdminDeletePlaceCommandHandler :
    ICommandHandler<AdminDeletePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationHubService;

    public AdminDeletePlaceCommandHandler(
        IRepository repository,
        INotificationService notificationService,
        IUserService userService)
    {
        _repository = repository;

        _userService = userService;
        _notificationHubService = notificationService;
    }

    public async Task<Result> Handle(
        AdminDeletePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var placeId = request.Model.PlaceId;
        var reason = request.Model.Reason;
        var currentUserId = request.CurrentUserId;

        var place = await _repository
            .All<Domain.Entities.Place>()
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p =>
                p.Id == placeId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.SoftDelete(place);
        place.IsDeletedByAdmin = true;

        foreach (var review in place.Reviews)
        {
            _repository.SoftDelete(review);
            review.IsDeletedByAdmin = true;
        }

        if (place.IsApproved)
        {
            place.IsApproved = false;

            await _userService.DecreaseUserPointsAsync(
                place.UserId.ToString(),
                UserPlaceUploadPoints);
        }

        if (place.UserId == currentUserId)
        {
            await _repository.SaveChangesAsync();
            return Result.Success(PlaceDeleteSuccess);
        }

        var notification = new Notification
        {
            ReceiverId = place.UserId,
            SenderId = currentUserId,
            Content = $"Your place '{place.Name}' was removed by an admin. Reason: {reason}"
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        await _notificationHubService.NotifyAsync(
            "An admin deleted your place!",
            place.UserId);

        return Result.Success(PlaceDeleteSuccess);
    }
}
