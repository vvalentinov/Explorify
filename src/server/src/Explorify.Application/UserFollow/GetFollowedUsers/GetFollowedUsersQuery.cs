using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.UserFollow.GetFollowedUsers;

public record GetFollowedUsersQuery(
    Guid CurrentUserId,
    int Page,
    string SortDirection = "asc") : IQuery<GetFollowedUsersDto>;
