using Explorify.Application.Abstractions.Models;

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
}
