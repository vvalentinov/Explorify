using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangeUserName;

public class ChangeUserNameCommandHandler
    : ICommandHandler<ChangeUserNameCommand>
{
    private readonly IUserService _userService;

    public ChangeUserNameCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result> Handle(
        ChangeUserNameCommand request,
        CancellationToken cancellationToken)
    {
        var result = await _userService.ChangeUserNameAsync(
            request.UserId,
            request.NewUserName);

        return result;
    }
}
