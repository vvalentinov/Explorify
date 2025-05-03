using Explorify.Persistence.Identity;
using Explorify.Infrastructure.Extensions;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationUserConstants.ErrorMessages;
using static Explorify.Domain.Constants.ApplicationUserConstants.SuccessMessages;
using static Explorify.Domain.Constants.EmailConstants;

using Microsoft.AspNetCore.Identity;
using Explorify.Application.Abstractions.Email;
using System.Web;
using System.Text.Encodings.Web;

namespace Explorify.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IEmailSender _emailSender;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(
        UserManager<ApplicationUser> userManager,
        IEmailSender emailSender)
    {
        _userManager = userManager;
        _emailSender = emailSender;
    }

    public async Task<Result> ChangeEmailAsync(
        string userId,
        string newEmail,
        string token)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Result.Failure(new Error(NoUserWithIdFoundError, ErrorType.Validation));
        }

        var changeEmailResult = await _userManager.ChangeEmailAsync(user, newEmail, token);

        if (changeEmailResult.Succeeded == false)
        {
            return Result.Failure();
        }

        return Result.Success();
    }

    public async Task<Result> ChangePasswordAsync(
        Guid userId,
        string oldPassword,
        string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            return Result.Failure(new Error(NoUserWithIdFoundError, ErrorType.Validation));
        }

        var changePassResult = await _userManager.ChangePasswordAsync(
            user,
            oldPassword,
            newPassword);

        if (changePassResult.Succeeded == false)
        {
            var error = new Error(changePassResult.GetFirstError(), ErrorType.Validation);
            return Result.Failure(error);
        }

        return Result.Success(PasswordChangeSuccess);
    }

    public async Task<Result> ChangeUserNameAsync(
        Guid userId,
        string newUserName)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            return Result.Failure(new Error(NoUserWithIdFoundError, ErrorType.Validation));
        }

        user.UserName = newUserName;

        var identityResult = await _userManager.UpdateAsync(user);

        if (identityResult.Succeeded == false)
        {
            var error = new Error(identityResult.GetFirstError(), ErrorType.Validation);
            return Result.Failure(error);
        }

        return Result.Success(UsernameChangeSuccess(newUserName));
    }

    public async Task<Result> ConfirmEmailAsync(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Result.Failure();
        }

        var confirmEmailResult = await _userManager.ConfirmEmailAsync(user, token);

        if (confirmEmailResult.Succeeded == false)
        {
            return Result.Failure();
        }

        return Result.Success();
    }

    public async Task<Result> SendEmailChangeAsync(string newEmail, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Result.Failure();
        }

        var token = await _userManager.GenerateChangeEmailTokenAsync(user, newEmail);

        var encodedToken = HttpUtility.UrlEncode(token);

        var changeEmailLink = $"https://localhost:7189/api/User/ChangeEmail?userId={user.Id}&token={encodedToken}&newEmail={newEmail}";

        var safeLink = HtmlEncoder.Default.Encode(changeEmailLink);

        var subject = "Email Change!";

        var messageBody = GetEmailChangeBody(safeLink);

        await _emailSender.SendEmailAsync(
            "noreply@explorify.click",
            "Explorify",
            newEmail,
            subject,
            messageBody);

        return Result.Success($"Successfully send an email to: {newEmail}");
    }
}
