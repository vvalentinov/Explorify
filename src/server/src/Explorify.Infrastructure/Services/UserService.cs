using Explorify.Persistence.Identity;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
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

        await _userManager.UpdateAsync(user);

        return Result.Success();
    }
}
