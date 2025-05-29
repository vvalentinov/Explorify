using Explorify.Api.Extensions;
using Explorify.Application.Home;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class HomeController : BaseController
{
    private readonly IMediator _mediator;

    public HomeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetData))]
    public async Task<IActionResult> GetData()
    {
        var query = new GetHomeDataQuery();
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
