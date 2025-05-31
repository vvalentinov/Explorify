using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.UserFollow.Unfollow;

public class UnfollowUserCommandHandler
    : ICommandHandler<UnfollowUserCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationService;

    public UnfollowUserCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationService)
    {
        _repository = repository;

        _userService = userService;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        UnfollowUserCommand request,
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

        var userFollow = await _repository
            .All<Domain.Entities.UserFollow>()
            .FirstOrDefaultAsync(uf =>
                uf.FollowerId == followerId &&
                uf.FolloweeId == followeeId,
                cancellationToken);

        if (userFollow is null)
        {
            var error = new Error("You are not following this user!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var decreaseUserPointsResult = await _userService.DecreaseUserPointsAsync(
            followeeId.ToString(),
            UserFollowPoints);

        if (decreaseUserPointsResult.IsFailure)
        {
            return decreaseUserPointsResult;
        }

        var notification = new Domain.Entities.Notification
        {
            Content = $"{currUserName} unfollowed you. Looks like it's time to win them back — you lost {UserFollowPoints} points.",
            SenderId = followerId,
            ReceiverId = followeeId,
        };

        _repository.SoftDelete(userFollow);
        _repository.Update(userFollow);

        await _repository.AddAsync(notification);

        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync(
            $"{currUserName} unfollowed you.",
            followeeId);

        return Result.Success("Successfully unfollowed user!");
    }
}
