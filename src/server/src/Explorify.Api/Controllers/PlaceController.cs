using Explorify.Api.Extensions;
using Explorify.Application.Places;
using Explorify.Application.Places.Upload;
using Explorify.Application.Places.Delete;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Places.Update;
using Explorify.Application.Places.GetPlace;
using Explorify.Application.Places.GetEditData;
using Explorify.Application.Places.GetPlacesInCategory;
using Explorify.Application.Places.GetPlacesInSubcategory;
using Explorify.Application.Places.GetPlaceBySlugifiedName;

using static Explorify.Api.Extensions.ControllerBaseExtensions;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class PlaceController : BaseController
{
    private readonly IMediator _mediator;

    public PlaceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost(nameof(Upload))]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromUploadForm] UploadPlaceRequestModel model)
        => this.CreatedAtActionOrProblemDetails(
                await _mediator.Send(
                    new UploadPlaceCommand(model)), nameof(Upload));

    [AllowAnonymous]
    [HttpGet(nameof(GetPlacesInCategory))]
    public async Task<IActionResult> GetPlacesInCategory(int categoryId, int page)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetPlacesInCategoryQuery(categoryId, page)));

    [AllowAnonymous]
    [HttpGet(nameof(GetPlacesInSubcategory))]
    public async Task<IActionResult> GetPlacesInSubcategory(int subcategoryId, int page)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetPlacesInSubcategoryQuery(subcategoryId, page)));

    [AllowAnonymous]
    [HttpGet(nameof(GetPlaceDetailsById))]
    public async Task<IActionResult> GetPlaceDetailsById(Guid placeId)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetPlaceByIdQuery(placeId)));

    [AllowAnonymous]
    [HttpGet(nameof(GetPlaceDetailsBySlugifiedName))]
    public async Task<IActionResult> GetPlaceDetailsBySlugifiedName(string slugifiedName)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetPlaceBySlugifiedNameQuery(slugifiedName)));

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete([FromQuery] Guid placeId)
    {
        var command = new DeletePlaceCommand(placeId, User.GetId(), User.IsAdmin());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetEditData))]
    public async Task<IActionResult> GetEditData(Guid placeId)
    {
        var query = new GetEditDataQuery(placeId, User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(Edit))]
    public async Task<IActionResult> Edit([FromEditForm] EditPlaceRequestModel model)
    {
        var command = new UpdatePlaceCommand(model);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }
}
