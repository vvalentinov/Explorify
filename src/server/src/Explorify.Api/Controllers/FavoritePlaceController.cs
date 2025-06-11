using Explorify.Api.Extensions;
using Explorify.Infrastructure;
using Explorify.Application.FavPlace.Add;
using Explorify.Application.FavPlace.Remove;
using Explorify.Application.FavPlace.GetFavPlaces;

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

    [PageValidationFilter]
    [HttpGet(nameof(GetUserFavorites))]
    public async Task<IActionResult> GetUserFavorites(int page)
    {
        var query = new GetFavPlacesQuery(User.GetId(), page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
