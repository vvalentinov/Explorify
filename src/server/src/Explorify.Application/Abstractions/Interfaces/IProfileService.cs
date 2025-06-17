using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IProfileService
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

    Task<Result> ChangeProfileImageAsync(
        string userId,
        string imageUrl);
}
