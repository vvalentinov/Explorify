using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.UserFollow.Unfollow;

public record UnfollowUserCommand(
    Guid FollowerId,
    Guid FolloweeId,
    string CurrUserName) : ICommand;
