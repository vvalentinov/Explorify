using Explorify.Persistence.Identity;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationRoleConstants;
using static Explorify.Domain.Constants.ApplicationUserConstants.ErrorMessages;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Explorify.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
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

    public async Task<Result> IncreaseUserPointsAsync(
        string userId,
        int points)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            var error = new Error("No user with id found!", ErrorType.Validation);
            return Result.Failure<UserDto>(error);
        }

        user.Points += points;

        await _userManager.UpdateAsync(user);

        return Result.Success();
    }

    public async Task<Result> DecreaseUserPointsAsync(string userId, int points)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            var error = new Error("No user with id found!", ErrorType.Validation);
            return Result.Failure<UserDto>(error);
        }

        if (user.Points - points < 0)
        {
            user.Points = 0;
        }
        else
        {
            user.Points -= points;
        }

        await _userManager.UpdateAsync(user);

        return Result.Success();
    }

    public async Task<int> GetUsersCountAsync()
        => await _userManager.Users.CountAsync();

    public async Task<Dictionary<string, string>> GetUserNamesByIdsAsync(List<string> userIds)
    {
        var result = await _userManager
            .Users
            .Where(x => userIds.Contains(x.Id.ToString().ToLower()))
            .Select(x => new { x.Id, x.UserName })
            .ToDictionaryAsync(
                x => x.Id.ToString().ToUpperInvariant(),
                x => x.UserName ?? string.Empty);

        return result;
    }

    public async Task<List<UserDto>> GetUserDtosByIdsAsync(List<string> usersIds)
    {
        var result = await _userManager
            .Users
            .Where(x => usersIds.Contains(x.Id.ToString().ToUpper()))
            .Select(x => new UserDto
            {
                Id = x.Id,
                Email = x.Email,
                ProfileImageUrl = x.ProfileImageUrl,
                UserName = x.UserName ?? string.Empty,
            }).ToListAsync();

        return result;
    }
}
