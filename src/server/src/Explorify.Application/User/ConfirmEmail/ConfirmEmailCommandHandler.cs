using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ConfirmEmail;

public class ConfirmEmailCommandHandler
    : ICommandHandler<ConfirmEmailCommand>
{
    private readonly IUserService _userService;

    public ConfirmEmailCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result> Handle(
        ConfirmEmailCommand request,
        CancellationToken cancellationToken)
            => await _userService.ConfirmEmailAsync(request.UserId, request.Token);
}
