using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IUserService
{
    Task<Result<int>> IncreaseUserPointsAsync(Guid userId, int points);

    Task<Result<int>> DecreaseUserPointsAsync(Guid userId, int points);

    Task<Result> ChangeBioAsync(Guid userId, string bio);

    Task<Result> ChangeUserRoleAsync(Guid userId, string newRole);
}
