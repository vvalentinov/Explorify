namespace Explorify.Application.Leaderboard;

public class LeaderboardResult
{
    public IEnumerable<LeaderboardUserDto> Users { get; set; } = [];

    public PaginationResponseModel Pagination { get; set; } = default!;
}
