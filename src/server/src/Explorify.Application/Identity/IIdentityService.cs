using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;
using Explorify.Application.Abstractions.Models;
using System.Security.Claims;

namespace Explorify.Application.Identity;

public interface IIdentityService
{
    Task<Result<AuthResponseModel>> LoginUserAsync(LoginRequestModel model);

    Task<Result<AuthResponseModel>> RegisterUserAsync(RegisterRequestModel model);

    Task<Result<IEnumerable<Claim>>> GetUserClaims(string userId);
}
