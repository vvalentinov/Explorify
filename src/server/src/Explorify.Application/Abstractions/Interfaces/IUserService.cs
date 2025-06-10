using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IUserService
{
    Task<Result<int>> IncreaseUserPointsAsync(string userId, int points);

    Task<Result<int>> DecreaseUserPointsAsync(string userId, int points);

    Task<Result> ChangeBioAsync(string userId, string bio);
}
