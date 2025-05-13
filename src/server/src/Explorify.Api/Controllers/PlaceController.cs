using Explorify.Api.Extensions;
using Explorify.Application.Places.Upload;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Places.GetPlace;
using Explorify.Application.Places.GetPlacesInCategory;
using Explorify.Application.Places.GetPlacesInSubcategory;

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
}
