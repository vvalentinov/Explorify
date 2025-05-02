using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Login;

public class LoginQueryHandler :
    IQueryHandler<LoginQuery, AuthResponseModel>
{
    private readonly IIdentityService _identityService;

    public LoginQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result<AuthResponseModel>> Handle(
        LoginQuery request,
        CancellationToken cancellationToken)
            => await _identityService.LoginUserAsync(request.Model);
}
