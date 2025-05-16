using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ConfirmEmail;

public class ConfirmEmailCommandHandler
    : ICommandHandler<ConfirmEmailCommand>
{
    private readonly IProfileService _profileService;

    public ConfirmEmailCommandHandler(IProfileService profileService)
    {
        _profileService = profileService;
    }

    public async Task<Result> Handle(
        ConfirmEmailCommand request,
        CancellationToken cancellationToken)
            => await _profileService.ConfirmEmailAsync(
                    request.UserId,
                    request.Token);
}
