using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Register;

public class RegisterCommandHandler
    : ICommandHandler<RegisterCommand, AuthResponseModel>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result<AuthResponseModel>> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
            => await _identityService.RegisterUserAsync(request.Model);
}
