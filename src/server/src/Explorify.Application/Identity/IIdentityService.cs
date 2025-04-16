using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;
using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Identity;

public interface IIdentityService
{
    Task<Result<(IdentityResponseModel Identity, string RefreshToken)>> LoginUserAsync(LoginRequestModel model);

    Task<Result<(IdentityResponseModel Identity, string RefreshToken)>> RegisterUserAsync(RegisterRequestModel model);
}
