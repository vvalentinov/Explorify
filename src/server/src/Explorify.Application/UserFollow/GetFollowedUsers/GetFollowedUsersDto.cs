namespace Explorify.Application.UserFollow.GetFollowedUsers;

public class GetFollowedUsersDto
{
    public PaginationResponseModel Pagination { get; set; } = new();

    public IEnumerable<FollowedUserDto> Users { get; set; } = [];
}
