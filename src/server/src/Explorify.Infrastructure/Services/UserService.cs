using Explorify.Persistence.Identity;
using Explorify.Infrastructure.Extensions;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationUserConstants.ErrorMessages;
using static Explorify.Domain.Constants.ApplicationUserConstants.SuccessMessages;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
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
}
