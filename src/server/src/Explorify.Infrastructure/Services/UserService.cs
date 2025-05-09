using System.Web;
using System.Text.Encodings.Web;

using Explorify.Persistence.Identity;
using Explorify.Infrastructure.Extensions;
using Explorify.Application.Abstractions.Email;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.User.GetProfileInfo;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.EmailConstants;
using static Explorify.Domain.Constants.ApplicationUserConstants.ErrorMessages;
using static Explorify.Domain.Constants.ApplicationUserConstants.SuccessMessages;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

    // TODO: Handle uncomfirmed emails
    public async Task<Result> SendForgotPasswordEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return Result.Failure();
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var encodedToken = HttpUtility.UrlEncode(token);

        var changeEmailLink = $"http://localhost:5173/account/reset-password?token={encodedToken}&email={email}";

        var safeLink = HtmlEncoder.Default.Encode(changeEmailLink);

        var subject = "Reset Your Password";

        var messageBody = GetPasswordResetBody(
            user.UserName ?? string.Empty,
            safeLink);

        await _emailSender.SendEmailAsync(
            "noreply@explorify.click",
            "Explorify",
            email,
            subject,
            messageBody);

        return Result.Success($"Successfully send a password reset email to: {email}");
    }

    public async Task<Result> ResetPasswordAsync(string email, string token, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return Result.Failure();
        }

        var result = await _userManager.ResetPasswordAsync(user, token, password);

        if (result.Succeeded)
        {
            return Result.Success("Successfully reseted password!");
        }

        var error = new Error(result.GetFirstError(), ErrorType.Validation);
        return Result.Failure(error);
    }

    public async Task<Result> SendEmailConfirmationAsync(
        string userId,
        string userName,
        string token,
        string email)
    {
        var confirmationLink = $"https://localhost:7189/api/User/ConfirmEmail?userId={userId}&token={token}";

        var safeLink = HtmlEncoder.Default.Encode(confirmationLink);

        var subject = "Email Confirmation!";

        var messageBody = GetEmailConfirmBody(userName ?? string.Empty, safeLink);

        await _emailSender.SendEmailAsync(
            "noreply@explorify.click",
            "Explorify",
            email,
            subject,
            messageBody);

        return Result.Success();
    }

    public async Task<Result> ChangeProfileImageAsync(
        string userId,
        string imageUrl)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Result.Failure();
        }

        user.ProfileImageUrl = imageUrl;
        await _userManager.UpdateAsync(user);

        return Result.Success();
    }

    public async Task<Result<GetProfileInfoResponseModel>> GetProfileInfo(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        //if (user == null)
        //{
        //    return Result.Failure();
        //}

        var model = new GetProfileInfoResponseModel
        {
            ProfileImageUrl = user?.ProfileImageUrl
        };

        return Result.Success(model);
    }

    public async Task<string?> GetUserProfileImageFileNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        var url = user?.ProfileImageUrl;

        if (url != null)
        {
            var fileName = url[(url.LastIndexOf('/') + 1)..];
            return fileName;
        }

        return null;
    }

    public async Task<Result<UserDto>> GetUserDtoByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            var error = new Error("No user with id found!", ErrorType.Validation);
            return Result.Failure<UserDto>(error);
        }

        var dto = user.MapToUserDto();

        return Result.Success(dto);
    }

    public async Task<Dictionary<Guid, UserReviewDto>> GetUsersReviewDtosByIdsAsync(IEnumerable<Guid> userIds)
    {
        var users = await _userManager.Users
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync();

        return users.ToDictionary(u => u.Id, u => u.MapToUserReviewDto());
    }

    public async Task<HashSet<Guid>> GetLikedReviewIdsByUserAsync(string userId, IEnumerable<Guid> reviewIds)
    {
        var user = await _userManager
            .Users
            .Include(u => u.ReviewLikes)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

        if (user == null)
        {
            return new HashSet<Guid>();
        }

        return user
            .ReviewLikes
            .Where(like => reviewIds.Contains(like.ReviewId))
            .Select(like => like.ReviewId)
            .ToHashSet();
    }

}
