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
        if (request.FollowerId == request.FolloweeId)
        {
            var error = new Error("You cannot follow/unfollow yourself!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var userFollow = await GetUserFollowAsync(request, cancellationToken);

        if (userFollow is null)
        {
            var error = new Error("You are not following this user!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var pointResult = await _userService.DecreaseUserPointsAsync(
            request.FolloweeId,
            UserFollowPoints);

        if (pointResult.IsFailure)
        {
            return pointResult;
        }

        SoftDeleteFollow(userFollow);

        await QueueUnfollowNotificationAsync(request);

        await _repository.SaveChangesAsync();

        await _notificationService.NotifyAsync(
            $"{request.CurrUserName} unfollowed you.",
            request.FolloweeId);

        return Result.Success("Successfully unfollowed user!");
    }

    private async Task<Domain.Entities.UserFollow?> GetUserFollowAsync(UnfollowUserCommand request, CancellationToken ct)
    {
        return await _repository
            .All<Domain.Entities.UserFollow>()
            .FirstOrDefaultAsync(uf =>
                uf.FollowerId == request.FollowerId &&
                uf.FolloweeId == request.FolloweeId,
                ct);
    }

    private void SoftDeleteFollow(Domain.Entities.UserFollow userFollow)
    {
        _repository.SoftDelete(userFollow);
        _repository.Update(userFollow);
    }

    private async Task QueueUnfollowNotificationAsync(UnfollowUserCommand request)
    {
        var notification = new Domain.Entities.Notification
        {
            Content = $"{request.CurrUserName} unfollowed you. Looks like it's time to win them back — you lost {UserFollowPoints} points.",
            SenderId = request.FollowerId,
            ReceiverId = request.FolloweeId
        };

        await _repository.AddAsync(notification);
    }
}
