using Explorify.Persistence.Identity;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationUserConstants.ErrorMessages;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<Result> IncreaseUserPointsAsync(string userId, int points)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            var error = new Error(NoUserWithIdFoundError, ErrorType.Validation);
            return Result.Failure<UserDto>(error);
        }

        user.Points += points;

        await _userManager.UpdateAsync(user);

        return Result.Success();
    }

    public async Task<Result> DecreaseUserPointsAsync(string userId, int points)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            var error = new Error(NoUserWithIdFoundError, ErrorType.Validation);
            return Result.Failure<UserDto>(error);
        }

        user.Points = Math.Max(0, user.Points - points);

        await _userManager.UpdateAsync(user);

        return Result.Success();
    }
}
