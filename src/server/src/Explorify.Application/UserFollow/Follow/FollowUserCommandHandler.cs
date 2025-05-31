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
        if (increasePointsResult.IsFailure) return increasePointsResult;

        var notification = new Domain.Entities.Notification
        {
            Content = $"{currUserName} just followed you! 🎉 You've earned {UserFollowPoints} points for being awesome!",
            SenderId = followerId,
            ReceiverId = followeeId,
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync($"{currUserName} started following you.", followeeId);

        return Result.Success("Successfully followed user!");
    }
}
