using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Identity.Models;

namespace Explorify.Application.Identity.Login;

public class LoginQueryHandler :
    IQueryHandler<LoginQuery, (IdentityResponseModel IdentityModel, string RefreshToken)>
{
    private readonly IIdentityService _identityService;

    public LoginQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result<(IdentityResponseModel IdentityModel, string RefreshToken)>> Handle(
        LoginQuery request,
        CancellationToken cancellationToken)
            => await _identityService.LoginUserAsync(request.Model);
}
