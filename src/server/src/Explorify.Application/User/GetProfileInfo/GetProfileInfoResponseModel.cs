namespace Explorify.Application.User.GetProfileInfo;

public class GetProfileInfoResponseModel
{
    public Guid UserId { get; set; }

    public string? ProfileImageUrl { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public int Points { get; set; }

    public int Contributions { get; set; }

    public int FollowersCount { get; set; }

    public int FollowingCount { get; set; }

    public bool IsFollowedByCurrentUser { get; set; }
}
