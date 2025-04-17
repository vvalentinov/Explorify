using Explorify.Application.Identity.Models;
using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Identity;

public interface IIdentityService
{
    Task<Result<(IdentityResponseModel Identity, string RefreshToken)>> LoginUserAsync(IdentityRequestModel model);

    Task<Result<(IdentityResponseModel Identity, string RefreshToken)>> RegisterUserAsync(IdentityRequestModel model);
}
