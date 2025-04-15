using MediatR;

namespace Explorify.Application.Identity.Login;

public class LoginRequestHandler :
    IRequestHandler<LoginRequest, (IdentityResponseModel, string)>
{
    private readonly IIdentityService _identityService;

    public LoginRequestHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<(IdentityResponseModel, string)> Handle(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _identityService.LoginUserAsync(request.Model);

        return result;
    }
}
