using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;

namespace Explorify.Application.Identity;

public interface IIdentityService
{
    Task<(IdentityResponseModel, string)> LoginUserAsync(LoginRequestModel model);

    Task<(IdentityResponseModel, string)> RegisterUserAsync(RegisterRequestModel model);
}
