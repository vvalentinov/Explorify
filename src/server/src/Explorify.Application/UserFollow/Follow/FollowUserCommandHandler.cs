using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.UserFollow.Follow;

public class FollowUserCommandHandler
    : ICommandHandler<FollowUserCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public FollowUserCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
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

        // check if already follow exists

        var userFollowExists = await _repository
            .AllAsNoTracking<Domain.Entities.UserFollow>()
            .AnyAsync(uf =>
                uf.FollowerId == followerId &&
                uf.FolloweeId == followeeId,
                cancellationToken);

        if (userFollowExists)
        {
            var error = new Error("You are already following this user!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var userFollow = new Domain.Entities.UserFollow
        {
            FolloweeId = followeeId,
            FollowerId = followerId,
        };

        var increaseUserPointsResult = await _userService.IncreaseUserPointsAsync(
            followeeId.ToString(),
            UserFollowPoints);

        if (increaseUserPointsResult.IsFailure)
        {
            return increaseUserPointsResult;
        }

        var notification = new Domain.Entities.Notification
        {
            Content = $"{currUserName} just followed you! 🎉 You've earned {UserFollowPoints} points for being awesome!",
            SenderId = followerId,
            ReceiverId = followeeId,
        };

        await _repository.AddAsync(userFollow);
        await _repository.AddAsync(notification);

        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync(
            $"{currUserName} started following you.",
            followeeId);

        return Result.Success("Successfully followed user!");
    }
}
