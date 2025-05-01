using Explorify.Application.Identity.Models;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

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
