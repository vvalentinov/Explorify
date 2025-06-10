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

    public async Task<Result<int>> IncreaseUserPointsAsync(string userId, int points)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            var error = new Error(NoUserWithIdFoundError, ErrorType.Validation);
            return Result.Failure<int>(error);
        }

        user.Points += points;

        await _userManager.UpdateAsync(user);

        return Result.Success(user.Points);
    }

    public async Task<Result<int>> DecreaseUserPointsAsync(string userId, int points)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            var error = new Error(NoUserWithIdFoundError, ErrorType.Validation);
            return Result.Failure<int>(error);
        }

        user.Points = Math.Max(0, user.Points - points);

        await _userManager.UpdateAsync(user);

        return Result.Success(user.Points);
    }

    public async Task<Result> ChangeBioAsync(string userId, string bio)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            var error = new Error(NoUserWithIdFoundError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (string.IsNullOrWhiteSpace(bio))
        {
            var error = new Error("User bio cannot be empty!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (bio.Length < 15 || bio.Length > 350)
        {
            var error = new Error("User bio must be between 15 and 350 characters long!", ErrorType.Validation);
            return Result.Failure(error);
        }

        user.Bio = bio;

        var identityResult = await _userManager.UpdateAsync(user);

        if (!identityResult.Succeeded)
        {
            var error = new Error("Unable", ErrorType.Validation);
            return Result.Failure(error);
        }

        return Result.Success("Successfully changed user bio!");
    }
}
