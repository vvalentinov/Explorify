using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeUserName;

public class ChangeUserNameCommandHandler
    : ICommandHandler<ChangeUserNameCommand>
{
    private readonly IProfileService _profileService;

    public ChangeUserNameCommandHandler(IProfileService profileService)
    {
        _profileService = profileService;
    }

    public async Task<Result> Handle(
        ChangeUserNameCommand request,
        CancellationToken cancellationToken)
        => await _profileService.ChangeUserNameAsync(
                request.UserId,
                request.NewUserName);
}
