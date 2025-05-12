using Explorify.Api.Extensions;
using Explorify.Application.Admin.ApprovePlace;
using Explorify.Application.Admin.GetDashboardInfo;
using Explorify.Application.Admin.GetUnapprovedPlaces;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

[Authorize(Roles = AdminRoleName)]
public class AdminController : BaseController
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPut(nameof(ApprovePlace))]
    public async Task<IActionResult> ApprovePlace([FromQuery] Guid placeId)
        => this.OkOrProblemDetails(
            await _mediator.Send(
                new ApprovePlaceCommand(placeId, User.GetId())));

    [HttpGet(nameof(GetDashboardInfo))]
    public async Task<IActionResult> GetDashboardInfo()
    {
        var query = new GetDashboardInfoQuery();
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetUnapprovedPlaces))]
    public async Task<IActionResult> GetUnapprovedPlaces(int page)
    {
        var query = new GetUnapprovedPlacesQuery(page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
