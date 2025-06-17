namespace Explorify.Application.UserFollow;

public class GetFollowedUsersDto
{
    public PaginationResponseModel Pagination { get; set; } = new();

    public IEnumerable<FollowedUserDto> Users { get; set; } = [];
}
