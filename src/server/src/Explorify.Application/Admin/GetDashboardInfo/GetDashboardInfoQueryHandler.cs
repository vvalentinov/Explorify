using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetDashboardInfo;

public class GetDashboardInfoQueryHandler
    : IQueryHandler<GetDashboardInfoQuery, GetDashboardInfoResponseModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetDashboardInfoQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<GetDashboardInfoResponseModel>> Handle(
        GetDashboardInfoQuery request,
        CancellationToken cancellationToken)
    {
        var unapprovedPlacesCount = await _repository
            .AllAsNoTracking<Domain.Entities.Place>()
            .Where(x => x.IsApproved == false)
            .CountAsync(cancellationToken);

        // TODO
        //var unapprovedReviews = await _repository
        //    .AllAsNoTracking<Review>()
        //    .Where(x => x.IsApproved == false)
        //    .CountAsync(cancellationToken);

        var usersCount = await _userService.GetUsersCountAsync();

        var responseModel = new GetDashboardInfoResponseModel
        {
            RegisteredUsersNumber = usersCount,
            UnapprovedPlacesNumber = unapprovedPlacesCount
        };

        return Result.Success(responseModel);
    }
}
