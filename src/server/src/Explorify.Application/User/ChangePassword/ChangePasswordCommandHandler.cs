using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangePassword;

public class ChangePasswordCommandHandler
    : ICommandHandler<ChangePasswordCommand>
{
    private readonly IProfileService _profileService;

    public ChangePasswordCommandHandler(IProfileService profileService)
    {
        _profileService = profileService;
    }

    public async Task<Result> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
        => await _profileService.ChangePasswordAsync(
                request.UserId,
                request.OldPassword,
                request.NewPassword);
}
