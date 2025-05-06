using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Abstractions.Interfaces;

namespace Explorify.Application.User.GetProfileInfo;

public class GetProfileInfoQueryHandler
    : IQueryHandler<GetProfileInfoQuery, GetProfileInfoResponseModel>
{
    private readonly IUserService _userService;

    public GetProfileInfoQueryHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<Result<GetProfileInfoResponseModel>> Handle(
        GetProfileInfoQuery request,
        CancellationToken cancellationToken)
            => await _userService.GetProfileInfo(request.UserId);
}
