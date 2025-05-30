﻿using Explorify.Application.Abstractions.Models;
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
        var placeId = request.Model.PlaceId;
        var reason = request.Model.Reason;
        var currUserId = request.CurrentUserId;

        var place = await _repository
            .All<Domain.Entities.Place>()
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x =>
                x.Id == placeId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (!place.IsApproved)
        {
            var error = new Error("This place is already unapproved!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.IsApproved = false;

        var review = place.Reviews.FirstOrDefault(x => x.UserId == place.UserId);

        if (review != null)
        {
            review.IsApproved = false;
        }

        await _userService.DecreaseUserPointsAsync(
            place.UserId.ToString(),
            UserPlaceUploadPoints);

        if (place.UserId != currUserId && string.IsNullOrWhiteSpace(reason))
        {
            var error = new Error("Reason for unapproving is required!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (place.UserId != currUserId)
        {
            var notification = new Domain.Entities.Notification
            {
                ReceiverId = place.UserId,
                SenderId = request.CurrentUserId,
                Content = $"Sad news! Your place \"{place.Name}\" was unapproved by an admin. Reason: {reason}."
            };

            await _repository.AddAsync(notification);
        }

        await _repository.SaveChangesAsync();

        if (place.UserId != currUserId)
        {
            await _notificationService.NotifyAsync(
                "Admin unapproved one of your places! Check your notifications.",
                place.UserId);
        }

        return Result.Success("Successfully unapproved place!");
    }
}
