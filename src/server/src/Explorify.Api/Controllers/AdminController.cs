using Explorify.Api.Extensions;
using Explorify.Application.Admin.GetDashboardInfo;
using Explorify.Application.Admin.GetPlaces.GetDeletedPlaces;
using Explorify.Application.Admin.GetPlaces.GetApprovedPlaces;
using Explorify.Application.Admin.GetPlaces.GetUnapprovedPlaces;
using Explorify.Application.Admin.GetReviews.GetUnapproved;
using Explorify.Application.Admin.GetReviews.GetApproved;
using Explorify.Application.Admin.GetReviews.GetDeleted;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Application.Admin.GetPlaceInfo;
using Explorify.Application.Admin.Place.DeletePlace;
using Explorify.Application.Admin.Place.ApprovePlace;
using Explorify.Application.Admin.Place.UnapprovePlace;
using Explorify.Application.Admin.Place.RevertPlace;
using Explorify.Application.Admin.Review.ApproveReview;

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

    [HttpGet(nameof(GetApprovedReviews))]
    public async Task<IActionResult> GetApprovedReviews(int page)
    {
        var query = new GetApprovedReviewsQuery(page);
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

    [HttpGet(nameof(GetDeletedReviews))]
    public async Task<IActionResult> GetDeletedReviews(int page)
    {
        var query = new GetDeletedReviewsQuery(page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetPlaceInfo))]
    public async Task<IActionResult> GetPlaceInfo(Guid placeId)
    {
        var query = new GetPlaceInfoQuery(placeId);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(DeletePlace))]
    public async Task<IActionResult> DeletePlace(AdminDeletePlaceDto model)
    {
        var command = new AdminDeletePlaceCommand(User.GetId(), model);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(UnapprovePlace))]
    public async Task<IActionResult> UnapprovePlace(UnapprovePlaceCommandDto model)
    {
        var command = new UnapprovePlaceCommand(model, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(RevertPlace))]
    public async Task<IActionResult> RevertPlace([FromBody] Guid placeId)
    {
        var command = new AdminRevertPlaceCommand(placeId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }
}
