using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IUserService
{
    Task<string?> GetUserProfileImageFileNameAsync(string userId);

    Task<Result<UserDto>> GetUserDtoByIdAsync(string userId);

    Task<List<UserDto>> GetUserDtosByIdsAsync(List<string> usersIds);

    Task<Dictionary<Guid, UserReviewDto>> GetUsersReviewDtosByIdsAsync(IEnumerable<Guid> userIds);

    Task<HashSet<Guid>> GetLikedReviewIdsByUserAsync(string userId, IEnumerable<Guid> reviewIds);

    Task<Result> IncreaseUserPointsAsync(
        string userId,
        int points);

    Task<int> GetUsersCountAsync();
}
