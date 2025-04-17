using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Identity.Models;

namespace Explorify.Application.Identity.Register;

public class RegisterCommandHandler
    : ICommandHandler<RegisterCommand, (IdentityResponseModel IdentityModel, string RefreshToken)>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result<(IdentityResponseModel IdentityModel, string RefreshToken)>> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
            => await _identityService.RegisterUserAsync(request.Model);
}
