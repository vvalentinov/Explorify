using Explorify.Api.Extensions;
using Explorify.Application.FavPlace.Add;
using Explorify.Application.FavPlace.Remove;

using MediatR;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.Controllers;

public class FavoritePlaceController : BaseController
{
    private readonly IMediator _mediator;

    public FavoritePlaceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost(nameof(Add))]
    public async Task<IActionResult> Add(Guid placeId)
    {
        var command = new AddFavPlaceCommand(placeId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(Remove))]
    public async Task<IActionResult> Remove(Guid placeId)
    {
        var command = new RemoveFavPlaceCommand(placeId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }
}
