using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

namespace Explorify.Application.Admin.MakeUserAdmin;

public class MakeUserAdminCommandHandler
    : ICommandHandler<MakeUserAdminCommand>
{
    private readonly IUserService _userService;

    public MakeUserAdminCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result> Handle(
        MakeUserAdminCommand request,
        CancellationToken cancellationToken)
            => await _userService.ChangeUserRoleAsync(
                request.UserId,
                AdminRoleName);
}
