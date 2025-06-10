using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Dapper;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.UserFollow.Follow;

public class FollowUserCommandHandler
    : ICommandHandler<FollowUserCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly IBadgeService _badgeService;
    private readonly INotificationQueueService _notificationQueueService;
    private readonly IDbConnection _dbConnection;

    public FollowUserCommandHandler(
        IRepository repository,
        IUserService userService,
        IBadgeService badgeService,
        INotificationQueueService notificationQueueService,
        IDbConnection dbConnection)
    {
        _repository = repository;

        _userService = userService;
        _badgeService = badgeService;
        _notificationQueueService = notificationQueueService;
        _dbConnection = dbConnection;
    }

    public async Task<Result> Handle(
        FollowUserCommand request,
        CancellationToken cancellationToken)
    {
        var followerId = request.FollowerId;
        var followeeId = request.FolloweeId;
        var currUserName = request.CurrUserName;

        if (followerId == followeeId)
        {
            var error = new Error("You cannot follow/unfollow yourself!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var existingFollow = await _repository
            .All<Domain.Entities.UserFollow>(ignoreQueryFilters: true)
            .FirstOrDefaultAsync(uf =>
                uf.FollowerId == followerId &&
                uf.FolloweeId == followeeId,
                cancellationToken);

        if (existingFollow != null)
        {
            if (!existingFollow.IsDeleted)
            {
                var error = new Error("You are already following this user!", ErrorType.Validation);
                return Result.Failure(error);
            }

            // cooldown enforcement
            //var cooldownPeriod = TimeSpan.FromHours(1);
            var cooldownPeriod = TimeSpan.FromSeconds(30);

            if (existingFollow.DeletedOn != null &&
                DateTime.UtcNow - existingFollow.DeletedOn < cooldownPeriod)
            {
                var error = new Error("You can follow this user again after some time.", ErrorType.Validation);
                return Result.Failure(error);
            }

            // Revive the follow
            existingFollow.IsDeleted = false;
            existingFollow.DeletedOn = null;
            existingFollow.CreatedOn = DateTime.UtcNow;
            _repository.Update(existingFollow);
        }
        else
        {
            var newFollow = new Domain.Entities.UserFollow
            {
                FollowerId = followerId,
                FolloweeId = followeeId,
            };

            await _repository.AddAsync(newFollow);
        }

        var increasePointsResult = await _userService.IncreaseUserPointsAsync(followeeId.ToString(), UserFollowPoints);

        if (increasePointsResult.IsFailure)
        {
            return increasePointsResult;
        }

        var pointBadges = await _badgeService.GrantPointThresholdBadgesAsync(followeeId, increasePointsResult.Data);
        foreach (var badge in pointBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: followerId,
                receiverId: followeeId,
                notificationContent: $"You've unlocked the \"{badge.BadgeName}\" badge. You are making progress, keep it up!",
                realTimeMessage: "You reached a new milestone!"
            );
        }

        const string sql = @"
            SELECT COUNT(*) 
            FROM UserFollows 
            WHERE FolloweeId = @FolloweeId AND IsDeleted = 0";

        var followerCount = await _dbConnection.ExecuteScalarAsync<int>(
            sql,
            new { FolloweeId = followeeId });

        var milestoneBadges = await _badgeService.GrantFollowerMilestoneBadgesAsync(followeeId, followerCount);
        foreach (var badge in milestoneBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: followerId,
                receiverId: followeeId,
                notificationContent: $"Congrats! You've unlocked the \"{badge.BadgeName}\" badge. You are making progress, keep it up!",
                realTimeMessage: "You earned a new badge!"
            );
        }

        _notificationQueueService.QueueNotification(
          senderId: followerId,
          receiverId: followeeId,
          notificationContent: $"{currUserName} just followed you! You've earned {UserFollowPoints} points for being awesome!",
          realTimeMessage: $"{currUserName} started following you."
      );

        var notifications = _notificationQueueService.GetPendingNotifications();
        if (notifications.Count > 0)
        {
            await _repository.AddRangeAsync(notifications);
        }

        await _repository.SaveChangesAsync();
        await _notificationQueueService.FlushAsync();

        return Result.Success("Successfully followed user!");
    }
}
