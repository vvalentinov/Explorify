namespace Explorify.Application.Admin.GetUsers;

public class GetUsersQueryDto
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public IEnumerable<UserDetailsDto> Users { get; set; } = [];
}
