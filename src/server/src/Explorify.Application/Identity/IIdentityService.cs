using Explorify.Application.Identity.Models;
using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Identity;

public interface IIdentityService
{
    Task<Result<AuthResponseModel>> LoginUserAsync(IdentityRequestModel model);

    Task<Result<AuthResponseModel>> RegisterUserAsync(IdentityRequestModel model);
}
