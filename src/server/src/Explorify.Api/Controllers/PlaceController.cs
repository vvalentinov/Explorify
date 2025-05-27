using Explorify.Api.DTOs;
using Explorify.Api.Extensions;
using Explorify.Application.Place.Edit;
using Explorify.Application.Place.Upload;
using Explorify.Application.Place.Delete;
using Explorify.Application.Place.Revert;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Place.Edit.GetEditData;
using Explorify.Application.Place.GetPlaces.GetDeleted;
using Explorify.Application.Place.GetPlaces.GetApproved;
using Explorify.Application.Place.GetPlace.GetPlaceById;
using Explorify.Application.Place.GetPlaces.GetUnapproved;
using Explorify.Application.Place.GetPlaces.GetPlacesInCategory;
using Explorify.Application.Place.GetPlaces.GetPlacesInSubcategory;
using Explorify.Application.Place.GetPlace.GetPlaceBySlugifiedName;

using static Explorify.Api.Extensions.ControllerBaseExtensions;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Application.Place.Search;

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
    public async Task<IActionResult> GetPlaceDetailsById(Guid placeId, bool isForAdmin)
    {
        var query = new GetPlaceByIdQuery(placeId, isForAdmin, User.GetId(), User.IsAdmin());

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetPlaceDetailsBySlugifiedName))]
    public async Task<IActionResult> GetPlaceDetailsBySlugifiedName(string slugifiedName)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetPlaceBySlugifiedNameQuery(slugifiedName)));

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete(DeletePlaceDto model)
    {
        var command = new DeletePlaceCommand(model, User.GetId(), User.IsAdmin());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetEditData))]
    public async Task<IActionResult> GetEditData(Guid placeId)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetEditDataQuery(placeId, User.GetId())));

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

    [HttpGet(nameof(GetApproved))]
    public async Task<IActionResult> GetApproved(int page, bool isForAdmin)
    {
        if (!User.IsAdmin() && isForAdmin)
        {
            var error = new Error("Only admins can access all approved places.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new GetApprovedPlacesQuery(
            page,
            isForAdmin,
            User.GetId());

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetUnapproved))]
    public async Task<IActionResult> GetUnapproved(int page, bool isForAdmin)
    {
        if (!User.IsAdmin() && isForAdmin)
        {
            var error = new Error("Only admins can access all unapproved places.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new GetUnapprovedPlacesQuery(
            page,
            isForAdmin,
            User.GetId());

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetDeleted))]
    public async Task<IActionResult> GetDeleted(int page, bool isForAdmin)
    {
        if (!User.IsAdmin() && isForAdmin)
        {
            var error = new Error("Only admins can access all recently deleted places.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new GetDeletedPlacesQuery(
            page,
            isForAdmin,
            User.GetId());

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(Search))]
    public async Task<IActionResult> Search([FromQuery] SearchPlaceRequestDto model, int page)
    {
        var query = new SearchPlaceQuery(model, page, User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
