using Explorify.Api.Extensions;
using Explorify.Application.Admin.GetDashboardInfo;
using Explorify.Application.Admin.Place.ApprovePlace;
using Explorify.Application.Admin.Place.UnapprovePlace;
using Explorify.Application.Admin.Review.ApproveReview;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Application.Admin.Review.UnapproveReview;

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
    {
        var command = new ApprovePlaceCommand(placeId, User.GetId());
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

    [HttpPut(nameof(ApproveReview))]
    public async Task<IActionResult> ApproveReview([FromQuery] Guid reviewId)
    {
        var command = new ApproveReviewCommand(reviewId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(UnapproveReview))]
    public async Task<IActionResult> UnapproveReview(UnapproveReviewDto model)
    {
        var command = new UnapproveReviewCommand(model, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetDashboardInfo))]
    public async Task<IActionResult> GetDashboardInfo()
    {
        var query = new GetDashboardInfoQuery();
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
