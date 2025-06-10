using System.Data;

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
        var place = await _repository
            .All<Domain.Entities.Place>()
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x =>
                x.Id == request.PlaceId,
                cancellationToken);

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var isPlaceOwner = place.UserId == request.CurrentUserId;

        // Check eligibility BEFORE approving
        var approvedPlacesCount = await _repository
            .AllAsNoTracking<Domain.Entities.Place>()
            .CountAsync(x => x.UserId == place.UserId && x.IsApproved, cancellationToken);

        var shouldGrantFirstPlaceBadge = approvedPlacesCount == 0;

        place.IsApproved = true;

        var review = place.Reviews.FirstOrDefault(x => x.UserId == place.UserId);

        if (review is not null)
        {
            review.IsApproved = true;
        }

        var increaseUserPointsRes = await _userService.IncreaseUserPointsAsync(place.UserId.ToString(), UserPlaceUploadPoints);

        if (increaseUserPointsRes.IsFailure)
        {
            return increaseUserPointsRes;
        }

        // Check for any point milestone badges (100, 500, 1000)
        var pointBadges = await _badgeService.GrantPointThresholdBadgesAsync(place.UserId, increaseUserPointsRes.Data);

        foreach (var pointBadge in pointBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: request.CurrentUserId,
                receiverId: place.UserId,
                notificationContent: $"You've unlocked the \"{pointBadge.BadgeName}\" badge. You are making progress, keep it up!",
                realTimeMessage: "You reached a new milestone!"
            );
        }

        // Check if we need to grant the "Place Pioneer" badge
        if (shouldGrantFirstPlaceBadge)
        {
            var badgeResult = await _badgeService.GrantBadgeAsync(place.UserId, "Place Pioneer");

            if (badgeResult is not null)
            {
                _notificationQueueService.QueueNotification(
                    senderId: request.CurrentUserId,
                    receiverId: place.UserId,
                    notificationContent: $"Congrats! You've unlocked the \"{badgeResult.BadgeName}\" badge. Keep exploring!",
                    realTimeMessage: "You earned a new badge!"
                );
            }
        }

        const string getFollowerIdsSql = @"
            SELECT FollowerId
            FROM UserFollows
            WHERE FolloweeId = @FolloweeId";

        var followerIds = (await _dbConnection.QueryAsync<Guid>(
            getFollowerIdsSql,
            new { FolloweeId = place.UserId }))
                .ToList();

        const string getUsernameSql = @"SELECT UserName FROM AspNetUsers WHERE Id = @UserId";
        var username = await _dbConnection.QueryFirstOrDefaultAsync<string>(getUsernameSql, new { place.UserId });

        // Queue notifications for followers
        foreach (var followerId in followerIds)
        {
            _notificationQueueService.QueueNotification(
                senderId: place.UserId,
                receiverId: followerId,
                notificationContent: $"{username} just uploaded a new place: \"{place.Name}\". Check it out!",
                realTimeMessage: $"{username} uploaded a new place!"
            );
        }

        // Notify the place owner if someone else approved their place
        if (!isPlaceOwner)
        {
            _notificationQueueService.QueueNotification(
                senderId: request.CurrentUserId,
                receiverId: place.UserId,
                notificationContent: $"Great news! Your place \"{place.Name}\" just got the seal of approval. You've earned {UserPlaceUploadPoints} adventure points – keep exploring!",
                realTimeMessage: "Admin approved your place upload!"
            );
        }

        var notifications = _notificationQueueService.GetPendingNotifications();

        if (notifications.Count > 0)
        {
            await _repository.AddRangeAsync(notifications);
        }

        await _repository.SaveChangesAsync();

        await _notificationQueueService.FlushAsync();

        return Result.Success("Successfully approved place!");
    }
}
