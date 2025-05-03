using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User;

public class ResetPasswordCommandHandler
    : ICommandHandler<ResetPasswordCommand>
{
    private readonly IUserService _userService;

    public ResetPasswordCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result> Handle(
        ResetPasswordCommand request,
        CancellationToken cancellationToken)
            => await _userService.ResetPasswordAsync(
                    request.Email,
                    request.Token,
                    request.Password);
}
