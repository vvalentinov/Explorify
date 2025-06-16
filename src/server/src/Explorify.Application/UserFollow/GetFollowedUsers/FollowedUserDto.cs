using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.UserFollow.GetFollowedUsers;

public class FollowedUserDto : UserDto
{
    public int Points { get; set; }

    public int Rank { get; set; }

    public int PlacesCount { get; set; }

    public int ReviewsCount { get; set; }
}
