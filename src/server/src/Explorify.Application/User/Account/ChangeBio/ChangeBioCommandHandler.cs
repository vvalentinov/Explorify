using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeBio;

public class ChangeBioCommandHandler
    : ICommandHandler<ChangeBioCommand>
{
    private readonly IUserService _userService;

    public ChangeBioCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result> Handle(
        ChangeBioCommand request,
        CancellationToken cancellationToken)
            => await _userService.ChangeBioAsync(request.UserId, request.Bio);
}
