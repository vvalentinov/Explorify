using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.UserFollow.GetFollowedUsers;

public class GetFollowedUsersDto
{
    public PaginationResponseModel Pagination { get; set; } = new();

    public IEnumerable<UserDto> Users { get; set; } = [];
}
