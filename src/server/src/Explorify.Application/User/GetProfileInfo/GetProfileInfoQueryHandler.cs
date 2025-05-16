using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetProfileInfo;

public class GetProfileInfoQueryHandler
    : IQueryHandler<GetProfileInfoQuery, GetProfileInfoResponseModel>
{
    private readonly IProfileService _profileService;

    public GetProfileInfoQueryHandler(IProfileService profileService)
    {
        _profileService = profileService;
    }

    public async Task<Result<GetProfileInfoResponseModel>> Handle(
        GetProfileInfoQuery request,
        CancellationToken cancellationToken)
            => await _profileService.GetProfileInfoAsync(request.UserId);
}
