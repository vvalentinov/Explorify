using System.Data;

using Explorify.Application.Badges;
using Explorify.Application.Notification;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Dapper;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Place.ApprovePlace;

public class ApprovePlaceCommandHandler
    : ICommandHandler<ApprovePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly IBadgeService _badgeService;
    private readonly INotificationQueueService _notificationQueueService;

    private readonly IDbConnection _dbConnection;

    public ApprovePlaceCommandHandler(
        IRepository repository,
        IUserService userService,
        IDbConnection dbConnection,
        IBadgeService badgeService,
        INotificationQueueService notificationQueueService)
    {
        _repository = repository;

        _userService = userService;
        _badgeService = badgeService;
        _notificationQueueService = notificationQueueService;

        _dbConnection = dbConnection;
    }

    public async Task<Result> Handle(
        ApprovePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await GetPlaceWithReviewsAsync(request.PlaceId, cancellationToken);

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var isPlaceOwner = place.UserId == request.CurrentUserId;

        place.Approve();

        var pointResult = await IncreasePointsAndGrantBadges(place.UserId, request.CurrentUserId);

        if (pointResult.IsFailure)
        {
            return pointResult;
        }

        await NotifyFollowers(place, request.CurrentUserId);

        NotifyPlaceOwnerIfNeeded(place, request.CurrentUserId, isPlaceOwner);

        await PersistNotificationsAndSave();

        return Result.Success("Successfully approved place!");
    }

    private async Task<Domain.Entities.Place?> GetPlaceWithReviewsAsync(
        Guid placeId,
        CancellationToken token)
    {
        return await _repository
            .All<Domain.Entities.Place>()
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x => x.Id == placeId, token);
    }

    private async Task<Result> IncreasePointsAndGrantBadges(Guid userId, Guid approverId)
    {
        var result = await _userService.IncreaseUserPointsAsync(
            userId,
            UserPlaceUploadPoints);

        if (result.IsFailure)
        {
            return result;
        }

        var pointBadges = await _badgeService.TryGrantPointThresholdBadgesAsync(userId);

        QueueBadgeNotifications(pointBadges, approverId, userId);

        var firstPlaceBadge = await _badgeService.TryGrantFirstPlaceBadgeAsync(userId);

        if (firstPlaceBadge is not null)
        {
            _notificationQueueService.QueueNotification(
                senderId: approverId,
                receiverId: userId,
                notificationContent: $"Congrats! You've unlocked the \"{firstPlaceBadge.BadgeName}\" badge. Keep exploring!",
                realTimeMessage: "You earned a new badge!"
            );
        }

        return Result.Success();
    }

    private void QueueBadgeNotifications(IEnumerable<BadgeGrantResult> badges, Guid senderId, Guid receiverId)
    {
        foreach (var badge in badges)
        {
            _notificationQueueService.QueueNotification(
                senderId: senderId,
                receiverId: receiverId,
                notificationContent: $"You've unlocked the \"{badge.BadgeName}\" badge. You are making progress, keep it up!",
                realTimeMessage: "You reached a new milestone!"
            );
        }
    }

    private async Task NotifyFollowers(Domain.Entities.Place place, Guid approverId)
    {
        var followerIds = (await _dbConnection.QueryAsync<Guid>(
            "SELECT FollowerId FROM UserFollows WHERE FolloweeId = @FolloweeId AND FollowerId != @ApproverId",
            new { FolloweeId = place.UserId, ApproverId = approverId }))
            .ToList();

        var username = await _dbConnection.QueryFirstOrDefaultAsync<string>(
            "SELECT UserName FROM AspNetUsers WHERE Id = @UserId",
            new { place.UserId });

        foreach (var followerId in followerIds)
        {
            _notificationQueueService.QueueNotification(
                senderId: place.UserId,
                receiverId: followerId,
                notificationContent: $"{username} just uploaded a new place: \"{place.Name}\". Check it out!",
                realTimeMessage: $"{username} uploaded a new place!"
            );
        }
    }

    private void NotifyPlaceOwnerIfNeeded(Domain.Entities.Place place, Guid approverId, bool isOwner)
    {
        if (isOwner)
        {
            return;
        }

        _notificationQueueService.QueueNotification(
            senderId: approverId,
            receiverId: place.UserId,
            notificationContent: $"Great news! Your place \"{place.Name}\" just got the seal of approval. You've earned {UserPlaceUploadPoints} adventure points – keep exploring!",
            realTimeMessage: "Admin approved your place upload!"
        );
    }

    private async Task PersistNotificationsAndSave()
    {
        var pending = _notificationQueueService.GetPendingNotifications();

        if (pending.Count > 0)
        {
            await _repository.AddRangeAsync(pending);
        }

        await _repository.SaveChangesAsync();
        await _notificationQueueService.FlushAsync();
    }
}
