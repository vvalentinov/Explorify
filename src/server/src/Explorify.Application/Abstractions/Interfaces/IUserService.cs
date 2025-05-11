using Explorify.Application.Abstractions.Models;
using Explorify.Application.User.GetProfileInfo;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IUserService
{
    Task<Result> ChangeUserNameAsync(
        Guid userId,
        string newUserName);

    Task<Result> ChangePasswordAsync(
        Guid userId,
        string oldPassword,
        string newPassword);

    Task<Result> ConfirmEmailAsync(
        string userId,
        string token);

    Task<Result> ChangeEmailAsync(
        string userId,
        string newEmail,
        string token);

    Task<Result> SendEmailChangeAsync(
        string newEmail,
        string userId);

    Task<Result> SendForgotPasswordEmailAsync(string email);

    Task<Result> ResetPasswordAsync(
        string email,
        string token,
        string password);

    Task<Result> SendEmailConfirmationAsync(
        string userId,
        string userName,
        string token,
        string email);

    Task<Result> ChangeProfileImageAsync(
        string userId,
        string imageUrl);

    Task<Result<GetProfileInfoResponseModel>> GetProfileInfo(string userId);

    Task<string?> GetUserProfileImageFileNameAsync(string userId);

    Task<Result<UserDto>> GetUserDtoByIdAsync(string userId);

    Task<Dictionary<Guid, UserReviewDto>> GetUsersReviewDtosByIdsAsync(IEnumerable<Guid> userIds);

    Task<HashSet<Guid>> GetLikedReviewIdsByUserAsync(string userId, IEnumerable<Guid> reviewIds);

    Task<Result> IncreaseUserPointsAsync(
        string userId,
        int points);

    Task<int> GetUsersCountAsync();

    Task<Dictionary<string, string>> GetUserNamesByIdsAsync(List<string> userIds);
}
