using Explorify.Api.Extensions;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Reviews.Upload;

using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.Controllers;

public class ReviewController : BaseController
{
    private readonly IMediator _mediator;

    public ReviewController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost(nameof(Upload))]
    public async Task<IActionResult> Upload([FromUploadReviewForm] UploadReviewRequestModel model)
        => this.CreatedAtActionOrProblemDetails(
                await _mediator.Send(new UploadReviewCommand(model)),
                nameof(Upload));
}
