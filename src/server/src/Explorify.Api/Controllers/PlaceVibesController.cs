using Explorify.Api.Extensions;
using Explorify.Application.Vibes.GetVibes;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class PlaceVibesController : BaseController
{
    private readonly IMediator _mediator;

    public PlaceVibesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetVibes))]
    public async Task<IActionResult> GetVibes()
    {
        var query = new GetVibesQuery();
        var vibes = await _mediator.Send(query);
        return this.OkOrProblemDetails(vibes);
    }
}
