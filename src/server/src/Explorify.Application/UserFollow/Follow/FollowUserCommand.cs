using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.UserFollow.Follow;

// FollowerId = current user id
public record FollowUserCommand(
    Guid FollowerId,
    Guid FolloweeId,
    string CurrUserName) : ICommand;
