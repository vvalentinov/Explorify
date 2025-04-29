using Explorify.Api.Extensions;
using Explorify.Application.Places.Upload;
using Explorify.Infrastructure.Attributes;
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
    public async Task<IActionResult> Upload([FromUploadForm] UploadPlaceRequestModel model)
    {
        var command = new UploadPlaceCommand(model);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetPlacesInCategory))]
    public async Task<IActionResult> GetPlacesInCategory(int categoryId)
    {
        var query = new GetPlacesInCategoryQuery(categoryId);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetPlacesInSubcategory))]
    public async Task<IActionResult> GetPlacesInSubcategory(int subcategoryId)
    {
        var query = new GetPlacesInSubcategoryQuery(subcategoryId);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
