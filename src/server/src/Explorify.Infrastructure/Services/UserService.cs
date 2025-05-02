using Explorify.Persistence.Identity;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    //public async Task<Result> SendEmailConfirmationLink(
    //    string email,
    //    Guid userId)
    //{
    //    var user = await _userManager.FindByIdAsync(userId.ToString());

    //    if (user == null)
    //    {
    //        var error = new Error("No user with given id found!", ErrorType.Validation);
    //        return Result.Failure(error);
    //    }

    //    string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

    //    var confirmationLink = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Token = token }, HttpContext.Request.Scheme);
    //}

    public async Task<Result> ChangePasswordAsync(
        Guid userId,
        string oldPassword,
        string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            var error = new Error("No user with given id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var changePassResult = await _userManager.ChangePasswordAsync(
            user,
            oldPassword,
            newPassword);

        if (changePassResult.Succeeded == false)
        {
            var error = new Error(
                changePassResult.Errors.Select(e => e.Description).First(),
                ErrorType.Validation);

            return Result.Failure(error);
        }

        return Result.Success($"Successfully changed password!");
    }

    public async Task<Result> ChangeUserNameAsync(
        Guid userId,
        string newUserName)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            var error = new Error("No user with given id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        user.UserName = newUserName;

        var identityResult = await _userManager.UpdateAsync(user);

        if (identityResult.Succeeded == false)
        {
            var error = new Error(
                identityResult.Errors.Select(e => e.Description).First(),
                ErrorType.Validation);

            return Result.Failure(error);
        }

        return Result.Success($"Successfully changed your username to: {newUserName}");
    }
}
