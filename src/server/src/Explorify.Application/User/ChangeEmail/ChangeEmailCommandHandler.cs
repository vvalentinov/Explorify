using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangeEmail;

public class ChangeEmailCommandHandler
    : ICommandHandler<ChangeEmailCommand>
{
    private readonly IProfileService _profileService;

    public ChangeEmailCommandHandler(IProfileService profileService)
    {
        _profileService = profileService;
    }

    public async Task<Result> Handle(
        ChangeEmailCommand request,
        CancellationToken cancellationToken)
            => await _profileService.ChangeEmailAsync(
                    request.UserId,
                    request.NewEmail,
                    request.Token);
}
