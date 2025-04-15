using MediatR;

namespace Explorify.Application.Identity.Register;

public class RegisterRequestHandler
    : IRequestHandler<RegisterRequest, (IdentityResponseModel, string)>
{
    private readonly IIdentityService _identityService;

    public RegisterRequestHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<(IdentityResponseModel, string)> Handle(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _identityService.RegisterUserAsync(request.Model);

        return result;
    }
}
