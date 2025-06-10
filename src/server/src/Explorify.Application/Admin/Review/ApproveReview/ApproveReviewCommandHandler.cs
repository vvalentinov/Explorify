using System.Data;

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
        var review = await _repository
            .All<Domain.Entities.Review>()
            .Include(x => x.Place)
            .FirstOrDefaultAsync(x =>
                x.Id == request.ReviewId,
                cancellationToken);

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

        review.IsApproved = true;
        _repository.Update(review);

        var increasePointsResult = await _userService.IncreaseUserPointsAsync(
            review.UserId.ToString(),
            UserReviewUploadPoints);

        if (increasePointsResult.IsFailure)
        {
            return increasePointsResult;
        }

        var pointBadges = await _badgeService.GrantPointThresholdBadgesAsync(
            review.UserId,
            increasePointsResult.Data);

        foreach (var badge in pointBadges)
        {
            _notificationQueueService.QueueNotification(
                senderId: request.CurrentUserId,
                receiverId: review.UserId,
                notificationContent: $"You've unlocked the \"{badge.BadgeName}\" badge. Keep up the great contributions!",
                realTimeMessage: "You reached a new milestone!"
            );
        }

        var reviewBadge = await _badgeService.GrantFirstReviewBadgeIfEligibleAsync(review.UserId);
        if (reviewBadge is not null)
        {
            _notificationQueueService.QueueNotification(
                senderId: request.CurrentUserId,
                receiverId: review.UserId,
                notificationContent: $"Congrats! You've earned the \"{reviewBadge.BadgeName}\" badge. Keep up the great contributions!",
                realTimeMessage: "You earned a new badge!"
            );
        }

        const string getUsernameSql = @"SELECT UserName FROM AspNetUsers WHERE Id = @UserId";
        var username = await _dbConnection.QueryFirstOrDefaultAsync<string>(getUsernameSql, new { review.UserId }) ?? "Someone";

        const string getFollowerIdsSql = @"
            SELECT FollowerId FROM UserFollows
            WHERE FolloweeId = @FolloweeId AND FollowerId != @CurrentUserId";

        var followerIds = (await _dbConnection.QueryAsync<Guid>(
          getFollowerIdsSql,
          new
          {
              FolloweeId = review.UserId,
              request.CurrentUserId
          })).ToList();

        foreach (var followerId in followerIds)
        {
            _notificationQueueService.QueueNotification(
                senderId: review.UserId,
                receiverId: followerId,
                notificationContent: $"{username} just uploaded a new review for \"{review.Place.Name}\". Go and check it out!",
                realTimeMessage: $"{username} uploaded a new review!"
            );
        }

        if (!isReviewOwner)
        {
            _notificationQueueService.QueueNotification(
                 senderId: request.CurrentUserId,
                 receiverId: review.UserId,
                 notificationContent: ReviewApprovedNotificationContent(review.Place.Name, UserReviewUploadPoints),
                 realTimeMessage: ReviewApprovedNotification
             );
        }

        var notifications = _notificationQueueService.GetPendingNotifications();

        if (notifications.Count > 0)
        {
            await _repository.AddRangeAsync(notifications);
        }

        await _repository.SaveChangesAsync();

        await _notificationQueueService.FlushAsync();

        return Result.Success(ReviewApprovedSuccess);
    }
}
