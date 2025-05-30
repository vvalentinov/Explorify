using Explorify.Api.Extensions;
using Explorify.Application.UserFollow.Follow;
using Explorify.Application.UserFollow.Unfollow;

using MediatR;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.Controllers;

public class FollowController : BaseController
{
    private readonly IMediator _mediator;

    public FollowController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("{followeeId}")]
    public async Task<IActionResult> FollowUser(Guid followeeId)
    {
        var command = new FollowUserCommand(
            FollowerId: User.GetId(),
            FolloweeId: followeeId,
            CurrUserName: User.GetUserName());

        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete("{followeeId}")]
    public async Task<IActionResult> UnfollowUser(Guid followeeId)
    {
        var command = new UnfollowUserCommand(
            FollowerId: User.GetId(),
            FolloweeId: followeeId,
            CurrUserName: User.GetUserName());

        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }
}
