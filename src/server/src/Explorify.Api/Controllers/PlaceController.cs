using Explorify.Api.DTOs;
using Explorify.Api.Extensions;
using Explorify.Application.Place.Edit;
using Explorify.Application.Place.Upload;
using Explorify.Application.Place.Delete;
using Explorify.Application.Place.Revert;
using Explorify.Application.Place.Search;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Place.Edit.GetEditData;
using Explorify.Application.Place.GetPlace.GetPlaceById;
using Explorify.Application.Place.GetPlaces.GetPlacesInCategory;
using Explorify.Application.Place.GetPlaces.GetPlacesInSubcategory;
using Explorify.Application.Place.GetPlace.GetPlaceBySlugifiedName;

using static Explorify.Api.Extensions.ControllerBaseExtensions;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Infrastructure;

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
    [PageValidationFilter]
    [HttpGet(nameof(GetPlacesInCategory))]
    public async Task<IActionResult> GetPlacesInCategory(int categoryId, int page)
    {
        var query = new GetPlacesInCategoryQuery(categoryId, page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetPlacesInSubcategory))]
    public async Task<IActionResult> GetPlacesInSubcategory(int subcategoryId, int page)
    {
        var query = new GetPlacesInSubcategoryQuery(subcategoryId, page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetPlaceDetailsById))]
    public async Task<IActionResult> GetPlaceDetailsById(Guid placeId, bool isForAdmin)
    {
        var query = new GetPlaceByIdQuery(
            placeId,
            isForAdmin,
            User.GetId(),
            User.IsAdmin());

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetPlaceDetailsBySlugifiedName))]
    public async Task<IActionResult> GetPlaceDetailsBySlugifiedName(string slugifiedName)
    {
        var query = new GetPlaceBySlugifiedNameQuery(slugifiedName);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete(DeletePlaceDto model)
    {
        var command = new DeletePlaceCommand(model, User.GetId(), User.IsAdmin());
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
    public async Task<IActionResult> Edit([FromForm] EditPlaceRequestDto model)
    {
        var applicationModel = await model.ToApplicationModelAsync(User.GetId());
        var command = new EditPlaceCommand(applicationModel);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(Revert))]
    public async Task<IActionResult> Revert(Guid placeId)
    {
        var revertPlaceCommand = new RevertPlaceCommand(
            placeId,
            User.GetId(),
            User.IsAdmin());

        var result = await _mediator.Send(revertPlaceCommand);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(Search))]
    public async Task<IActionResult> Search([FromQuery] SearchPlaceRequestDto model, int page)
    {
        if (!User.IsAdmin() && model.Context == SearchContext.Admin)
        {
            var error = new Error("You are not authorized to perform this search.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        if (!User.IsAuthenticated() && model.Context == SearchContext.UserPlaces)
        {
            var error = new Error("You must be authorized to perform this search.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new SearchPlaceQuery(model, page, User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
