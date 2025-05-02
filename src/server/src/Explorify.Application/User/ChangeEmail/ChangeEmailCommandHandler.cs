using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangeEmail;

public class ChangeEmailCommandHandler : ICommandHandler<ChangeEmailCommand>
{
    private readonly IUserService _userService;

    public ChangeEmailCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result> Handle(
        ChangeEmailCommand request,
        CancellationToken cancellationToken)
    {
        var result = await _userService.ChangeEmailAsync(request.UserId, request.NewEmail, request.Token);

        return result;
    }
}
