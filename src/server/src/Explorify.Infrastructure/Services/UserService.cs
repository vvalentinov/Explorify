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

    public async Task<Result<int>> IncreaseUserPointsAsync(Guid userId, int points)
    {
        var user = await FindUserAsync(userId);

        if (user is null)
        {
            return UserNotFoundError<int>();
        }

        user.Points += points;

        var identityResult = await _userManager.UpdateAsync(user);

        if (identityResult.Succeeded is false)
        {
            return IdentityFailure<int>(identityResult, "Failed to update user points");
        }

        return Result.Success(user.Points);
    }

    public async Task<Result<int>> DecreaseUserPointsAsync(Guid userId, int points)
    {
        var user = await FindUserAsync(userId);

        if (user is null)
        {
            return UserNotFoundError<int>();
        }

        user.Points = Math.Max(0, user.Points - points);

        var identityResult = await _userManager.UpdateAsync(user);

        if (identityResult.Succeeded is false)
        {
            return IdentityFailure<int>(identityResult, "Failed to update user points");
        }

        return Result.Success(user.Points);
    }

    public async Task<Result> ChangeBioAsync(Guid userId, string bio)
    {
        var user = await FindUserAsync(userId);

        if (user is null)
        {
            return UserNotFoundError();
        }

        if (string.IsNullOrWhiteSpace(bio))
        {
            var error = new Error("User bio cannot be empty!", ErrorType.Validation);
            return Result.Failure(error);
        }
            
        if (bio.Length is < 15 or > 350)
        {
            var error = new Error("User bio must be between 15 and 350 characters long!", ErrorType.Validation);
            return Result.Failure(error);
        }

        user.Bio = bio;

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded is false)
        {
            var error = new Error("Unable to update user bio", ErrorType.Failure);
            return Result.Failure(error);
        }
            
        return Result.Success("Successfully changed user bio!");
    }

    private async Task<ApplicationUser?> FindUserAsync(Guid userId)
        => await _userManager.FindByIdAsync(userId.ToString());

    private static Result<T> UserNotFoundError<T>() =>
        Result.Failure<T>(new Error(NoUserWithIdFoundError, ErrorType.Validation));

    private static Result UserNotFoundError() =>
        Result.Failure(new Error(NoUserWithIdFoundError, ErrorType.Validation));

    private static Result<T> IdentityFailure<T>(IdentityResult result, string failurePrefix)
    {
        var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        return Result.Failure<T>(new Error($"{failurePrefix}: {errors}", ErrorType.Failure));
    }
}
