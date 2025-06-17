using Explorify.Api.Extensions;
using Explorify.Application.Badges;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class BadgeController : BaseController
{
    private readonly IMediator _mediator;

    public BadgeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetUserBadges))]
    public async Task<IActionResult> GetUserBadges(Guid? userId = null)
    {
        var result = await _mediator.Send(new GetUserBadgesQuery(userId ?? User.GetId()));
        return this.OkOrProblemDetails(result);
    }
}
