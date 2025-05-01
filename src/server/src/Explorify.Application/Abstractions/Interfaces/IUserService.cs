using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IUserService
{
    Task<Result> ChangeUserNameAsync(
        Guid userId,
        string newUserName);
}
