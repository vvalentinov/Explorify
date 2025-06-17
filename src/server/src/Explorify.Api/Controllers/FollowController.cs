using Explorify.Api.Extensions;
using Explorify.Infrastructure;
using Explorify.Application.UserFollow.Follow;
using Explorify.Application.UserFollow.Unfollow;
using Explorify.Application.UserFollow.GetFollowedUsers;

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

    [PageValidationFilter]
    [HttpGet(nameof(GetFollowing))]
    public async Task<IActionResult> GetFollowing(
        int page = 1,
        string sortDirection = "asc",
        string? userName = null)
    {
        var query = new GetFollowedUsersQuery(User.GetId(), page, sortDirection, userName);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
