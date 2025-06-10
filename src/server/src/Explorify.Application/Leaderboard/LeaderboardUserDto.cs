namespace Explorify.Application.Leaderboard;

public class LeaderboardUserDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string ProfileImageUrl { get; set; } = string.Empty;

    public int Points { get; set; }

    public string Bio { get; set; } = string.Empty;

    public int PlacesCount { get; set; }

    public int ReviewsCount { get; set; }

    public int Rank { get; set; }
}
