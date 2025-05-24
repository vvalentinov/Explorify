using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Place.ApprovePlace;

public class ApprovePlaceCommandHandler
    : ICommandHandler<ApprovePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationHubService;

    public ApprovePlaceCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationHubService)
    {
        _repository = repository;

        _userService = userService;
        _notificationHubService = notificationHubService;
    }

    public async Task<Result> Handle(
        ApprovePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .All<Domain.Entities.Place>()
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x =>
                x.Id == request.PlaceId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        place.IsApproved = true;

        var review = place.Reviews.FirstOrDefault(x => x.UserId == place.UserId);

        if (review != null)
        {
            review.IsApproved = true;
        }

        await _userService.IncreaseUserPointsAsync(
            place.UserId.ToString(),
            UserPlaceUploadPoints);

        var notification = new Notification
        {
            ReceiverId = place.UserId,
            SenderId = request.CurrentUserId,
            Content = $"Great news! Your place \"{place.Name}\" just got the seal of approval. You've earned 10 adventure points – keep exploring!"
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        await _notificationHubService.NotifyAsync(
            "Admin approved your place upload!",
            place.UserId);

        return Result.Success("Successfully approved place!");
    }
}
