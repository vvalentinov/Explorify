using System.Data;

using Explorify.Application.Badges;
using Explorify.Application.Notification;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using static Explorify.Domain.Constants.ReviewConstants;
using static Explorify.Domain.Constants.ReviewConstants.ErrorMessages;
using static Explorify.Domain.Constants.ReviewConstants.SuccessMessages;

using Dapper;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Review.ApproveReview;

public class ApproveReviewCommandHandler
    : ICommandHandler<ApproveReviewCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;

    private readonly IDbConnection _dbConnection;
    private readonly IBadgeService _badgeService;
    private readonly INotificationQueueService _notificationQueueService;

    public ApproveReviewCommandHandler(
        IRepository repository,
        IUserService userService,
        IDbConnection dbConnection,
        IBadgeService badgeService,
        INotificationQueueService notificationQueueService)
    {
        _repository = repository;

        _userService = userService;

        _dbConnection = dbConnection;
        _badgeService = badgeService;
        _notificationQueueService = notificationQueueService;
    }

    public async Task<Result> Handle(
        ApproveReviewCommand request,
        CancellationToken cancellationToken)
    {
        var review = await GetReviewWithPlaceAsync(request.ReviewId, cancellationToken);

        if (review is null)
        {
            var error = new Error(NoReviewWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.IsApproved)
        {
            var error = new Error(ReviewAlreadyApprovedError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var isReviewOwner = review.UserId == request.CurrentUserId;

        review.Approve();

        var pointResult = await _userService.IncreaseUserPointsAsync(
            review.UserId,
            UserReviewUploadPoints);

        if (pointResult.IsFailure)
        {
            return pointResult;
        }

        await GrantBadgesAsync(review, request.CurrentUserId);
        await NotifyFollowersAsync(review, request.CurrentUserId);

        if (isReviewOwner is false)
        {
            NotifyReviewOwner(review, request.CurrentUserId);
        }

        await PersistChangesAsync();

        return Result.Success(ReviewApprovedSuccess);
    }

    private async Task<Domain.Entities.Review?> GetReviewWithPlaceAsync(Guid reviewId, CancellationToken ct)
    {
        return await _repository
            .All<Domain.Entities.Review>()
            .Include(r => r.Place)
            .FirstOrDefaultAsync(r => r.Id == reviewId, ct);
    }

    private async Task GrantBadgesAsync(Domain.Entities.Review review, Guid adminId)
    {
        var pointBadges = await _badgeService.TryGrantPointThresholdBadgesAsync(review.UserId);

        foreach (var badge in pointBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: adminId,
                receiverId: review.UserId,
                notificationContent: $"You've unlocked the \"{badge.BadgeName}\" badge. Keep up the great contributions!",
                realTimeMessage: "You reached a new milestone!"
            );
        }

        var reviewBadge = await _badgeService.TryGrantFirstReviewBadgeAsync(review.UserId);

        if (reviewBadge is not null)
        {
            _notificationQueueService.QueueNotification(
                senderId: adminId,
                receiverId: review.UserId,
                notificationContent: $"Congrats! You've earned the \"{reviewBadge.BadgeName}\" badge. Keep up the great contributions!",
                realTimeMessage: "You earned a new badge!"
            );
        }
    }

    private async Task NotifyFollowersAsync(
        Domain.Entities.Review review,
        Guid approverId)
    {
        const string getUsernameSql = @"SELECT UserName FROM AspNetUsers WHERE Id = @UserId";

        var username = await _dbConnection.QueryFirstOrDefaultAsync<string>(
            getUsernameSql, new { review.UserId }) ?? "Someone";

        const string getFollowerIdsSql = @"
            SELECT FollowerId FROM UserFollows
            WHERE FolloweeId = @FolloweeId AND FollowerId != @CurrentUserId";

        var followerIds = (await _dbConnection.QueryAsync<Guid>(
            getFollowerIdsSql,
            new { FolloweeId = review.UserId, CurrentUserId = approverId }
        )).ToList();

        foreach (var followerId in followerIds)
        {
            _notificationQueueService.QueueNotification(
                senderId: review.UserId,
                receiverId: followerId,
                notificationContent: $"{username} just uploaded a new review for \"{review.Place.Name}\". Go and check it out!",
                realTimeMessage: $"{username} uploaded a new review!"
            );
        }
    }

    private void NotifyReviewOwner(Domain.Entities.Review review, Guid approverId)
    {
        _notificationQueueService.QueueNotification(
            senderId: approverId,
            receiverId: review.UserId,
            notificationContent: ReviewApprovedNotificationContent(review.Place.Name, UserReviewUploadPoints),
            realTimeMessage: ReviewApprovedNotification
        );
    }

    private async Task PersistChangesAsync()
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
