using Explorify.Api.Extensions;
using Explorify.Application.Admin.ApprovePlace;
using Explorify.Application.Admin.ApproveReview;
using Explorify.Application.Admin.GetDashboardInfo;
using Explorify.Application.Admin.GetDeletedPlaces;
using Explorify.Application.Admin.GetApprovedPlaces;
using Explorify.Application.Admin.GetUnapprovedPlaces;
using Explorify.Application.Admin.GetUnapprovedReviews;

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

    [HttpPut(nameof(ApproveReview))]
    public async Task<IActionResult> ApproveReview([FromQuery] Guid reviewId)
        => this.OkOrProblemDetails(
            await _mediator.Send(
                new ApproveReviewCommand(reviewId, CurrentUserId: User.GetId())));

    [HttpGet(nameof(GetDashboardInfo))]
    public async Task<IActionResult> GetDashboardInfo()
    {
        var query = new GetDashboardInfoQuery();
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetApprovedPlaces))]
    public async Task<IActionResult> GetApprovedPlaces(int page)
    {
        var query = new GetApprovedPlacesQuery(page);
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

    [HttpGet(nameof(GetDeletedPlaces))]
    public async Task<IActionResult> GetDeletedPlaces(int page)
    {
        var query = new GetDeletedPlacesQuery(page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetUnapprovedReviews))]
    public async Task<IActionResult> GetUnapprovedReviews(int page)
    {
        var query = new GetUnapprovedReviewsQuery(page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
