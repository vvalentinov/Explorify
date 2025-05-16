using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User;

public class ResetPasswordCommandHandler
    : ICommandHandler<ResetPasswordCommand>
{
    private readonly IProfileService _profileService;

    public ResetPasswordCommandHandler(IProfileService profileService)
    {
        _profileService = profileService;
    }

    public async Task<Result> Handle(
        ResetPasswordCommand request,
        CancellationToken cancellationToken)
            => await _profileService.ResetPasswordAsync(
                    request.Email,
                    request.Token,
                    request.Password);
}
