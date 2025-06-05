using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IUserService
{
    Task<Result> IncreaseUserPointsAsync(string userId, int points);

    Task<Result> DecreaseUserPointsAsync(string userId, int points);
}
