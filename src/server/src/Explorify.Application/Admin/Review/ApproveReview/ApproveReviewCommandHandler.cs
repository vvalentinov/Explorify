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
    private readonly INotificationService _notificationService;

    private readonly IDbConnection _dbConnection;

    public ApproveReviewCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationService,
        IDbConnection dbConnection)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;

        _dbConnection = dbConnection;
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

        review.IsApproved = true;

        var increasePointsResult = await _userService.IncreaseUserPointsAsync(
            review.UserId.ToString(),
            UserReviewUploadPoints);

        if (increasePointsResult.IsFailure)
        {
            return increasePointsResult;
        }

        var isReviewOwner = review.UserId == request.CurrentUserId;

        _repository.Update(review);

        const string getUsernameSql = @"SELECT UserName FROM AspNetUsers WHERE Id = @UserId";
        var username = await _dbConnection.QueryFirstOrDefaultAsync<string>(getUsernameSql, new { review.UserId }) ?? "Someone";

        var followerIds = await _repository
            .AllAsNoTracking<Domain.Entities.UserFollow>()
            .Where(x => x.FolloweeId == review.UserId && x.FollowerId != request.CurrentUserId)
            .Select(x => x.FollowerId)
            .ToListAsync(cancellationToken);
    
        if (followerIds.Count > 0)
        {
            var followerNotifications = followerIds.Select(followerId => new Domain.Entities.Notification
            {
                ReceiverId = followerId,
                SenderId = review.UserId,
                Content = $"{username} just uploaded a new review for place: \"{review.Place.Name}\". Go and check it out!"
            }).ToList();

            await _repository.AddRangeAsync(followerNotifications);
        }

        if (!isReviewOwner)
        {
            var notification = new Domain.Entities.Notification
            {
                ReceiverId = review.UserId,
                SenderId = request.CurrentUserId,
                Content = ReviewApprovedNotificationContent(review.Place.Name, UserReviewUploadPoints)
            };

            await _repository.AddAsync(notification);
        }

        await _repository.SaveChangesAsync();

        if (!isReviewOwner)
        {
            await _notificationService.NotifyAsync(
                ReviewApprovedNotification,
                review.UserId);
        }

        foreach (var followerId in followerIds)
        {
            await _notificationService.NotifyAsync($"{username} uploaded a new review!", followerId);
        }

        return Result.Success(ReviewApprovedSuccess);
    }
}
