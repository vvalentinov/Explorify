using Explorify.Application.Places.Upload;
using Explorify.Infrastructure.Attributes;

using static Explorify.Api.Extensions.ControllerBaseExtensions;

using MediatR;
using Microsoft.AspNetCore.Mvc;

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
}
