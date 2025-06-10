using Explorify.Infrastructure;
using Explorify.Api.Extensions;
using Explorify.Application.Leaderboard;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class LeaderboardController : BaseController
{
    private readonly IMediator _mediator;

    public LeaderboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetInfo))]
    public async Task<IActionResult> GetInfo(int page = 1)
    {
        var query = new GetLeaderboardQuery(page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(Search))]
    public async Task<IActionResult> Search(string userName, int page = 1)
    {
        var query = new SearchUserQuery(userName, page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
