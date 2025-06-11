using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;
using Explorify.Application.Badges;
using Explorify.Application.Notification;

namespace Explorify.Application.UserFollow.Follow;

public class FollowUserCommandHandler
    : ICommandHandler<FollowUserCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly IBadgeService _badgeService;
    private readonly INotificationQueueService _notificationQueueService;

    public FollowUserCommandHandler(
        IRepository repository,
        IUserService userService,
        IBadgeService badgeService,
        INotificationQueueService notificationQueueService)
    {
        _repository = repository;

        _userService = userService;
        _badgeService = badgeService;
        _notificationQueueService = notificationQueueService;
    }

    public async Task<Result> Handle(
        FollowUserCommand request,
        CancellationToken cancellationToken)
    {
        if (request.FollowerId == request.FolloweeId)
        {
            var error = new Error("You cannot follow/unfollow yourself!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var followResult = await ProcessFollowAsync(
            request.FollowerId,
            request.FolloweeId,
            cancellationToken);

        if (followResult.IsFailure)
        {
            return followResult;
        }

        var pointResult = await _userService.IncreaseUserPointsAsync(
            request.FolloweeId,
            UserFollowPoints);

        if (pointResult.IsFailure)
        {
            return pointResult;
        }

        await HandlePointBadgesAsync(request.FollowerId, request.FolloweeId);
        await HandleMilestoneBadgesAsync(request.FollowerId, request.FolloweeId);

        QueueFollowNotification(
            request.FollowerId,
            request.FolloweeId,
            request.CurrUserName);

        await SaveAllAsync();

        return Result.Success("Successfully followed user!");
    }

    private async Task<Result> ProcessFollowAsync(
        Guid followerId,
        Guid followeeId,
        CancellationToken ct)
    {
        var existingFollow = await _repository
            .All<Domain.Entities.UserFollow>(ignoreQueryFilters: true)
            .FirstOrDefaultAsync(uf =>
                uf.FollowerId == followerId &&
                uf.FolloweeId == followeeId,
                ct);

        if (existingFollow is not null)
        {
            if (existingFollow.IsDeleted is false)
            {
                var error = new Error("You are already following this user!", ErrorType.Validation);
                return Result.Failure(error);
            }

            var cooldownPeriod = TimeSpan.FromSeconds(30);

            if (existingFollow.DeletedOn is not null && DateTime.UtcNow - existingFollow.DeletedOn < cooldownPeriod)
            {
                var error = new Error("You can follow this user again after some time.", ErrorType.Validation);
                return Result.Failure(error);
            }

            existingFollow.IsDeleted = false;
            existingFollow.DeletedOn = null;
            existingFollow.CreatedOn = DateTime.UtcNow;

            _repository.Update(existingFollow);
        }
        else
        {
            await _repository.AddAsync(new Domain.Entities.UserFollow
            {
                FollowerId = followerId,
                FolloweeId = followeeId
            });
        }

        return Result.Success();
    }

    private async Task HandlePointBadgesAsync(Guid followerId, Guid followeeId)
    {
        var pointBadges = await _badgeService.TryGrantPointThresholdBadgesAsync(followeeId);

        foreach (var badge in pointBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: followerId,
                receiverId: followeeId,
                notificationContent: $"You've unlocked the \"{badge.BadgeName}\" badge. You are making progress, keep it up!",
                realTimeMessage: "You reached a new milestone!");
        }
    }

    private async Task HandleMilestoneBadgesAsync(Guid followerId, Guid followeeId)
    {
        var milestoneBadges = await _badgeService.TryGrantFollowerMilestoneBadgesAsync(followeeId);

        foreach (var badge in milestoneBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: followerId,
                receiverId: followeeId,
                notificationContent: $"Congrats! You've unlocked the \"{badge.BadgeName}\" badge. You are making progress, keep it up!",
                realTimeMessage: "You earned a new badge!");
        }
    }

    private void QueueFollowNotification(Guid followerId, Guid followeeId, string followerName)
    {
        _notificationQueueService.QueueNotification(
            senderId: followerId,
            receiverId: followeeId,
            notificationContent: $"{followerName} just followed you! You've earned {UserFollowPoints} points for being awesome!",
            realTimeMessage: $"{followerName} started following you.");
    }

    private async Task SaveAllAsync()
    {
        var notifications = _notificationQueueService.GetPendingNotifications();

        if (notifications.Count > 0)
        {
            await _repository.AddRangeAsync(notifications);
        }

        await _repository.SaveChangesAsync();
        await _notificationQueueService.FlushAsync();
    }
}
