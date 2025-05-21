using Explorify.Api.DTOs;
using Explorify.Api.Extensions;
using Explorify.Application.Places.Upload;
using Explorify.Application.Places.Delete;
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
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromForm] UploadPlaceRequestDto model)
    {
        var applicationModel = await model.ToApplicationModelAsync(User.GetId());

        var command = new UploadPlaceCommand(applicationModel);

        var result = await _mediator.Send(command);

        return this.CreatedAtActionOrProblemDetails(result, nameof(Upload));
    }

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
                    new GetPlaceByIdQuery(placeId, User.GetId())));

    [AllowAnonymous]
    [HttpGet(nameof(GetPlaceDetailsBySlugifiedName))]
    public async Task<IActionResult> GetPlaceDetailsBySlugifiedName(string slugifiedName)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetPlaceBySlugifiedNameQuery(slugifiedName)));

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete([FromQuery] Guid placeId)
        => this.OkOrProblemDetails(
            await _mediator.Send(
                new DeletePlaceCommand(
                    placeId,
                    User.GetId(),
                    User.IsAdmin())));

    [HttpGet(nameof(GetEditData))]
    public async Task<IActionResult> GetEditData(Guid placeId)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetEditDataQuery(placeId, User.GetId())));

    [HttpPut(nameof(Edit))]
    public async Task<IActionResult> Edit([FromForm] EditPlaceRequestDto model)
    {
        var applicationModel = await model.ToApplicationModelAsync(User.GetId());

        var command = new UpdatePlaceCommand(applicationModel);

        var result = await _mediator.Send(command);

        return this.OkOrProblemDetails(result);
    }
}
