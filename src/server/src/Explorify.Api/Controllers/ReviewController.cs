using Explorify.Api.Extensions;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.Reviews.GetReviews;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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

    [AllowAnonymous]
    [HttpGet(nameof(GetReviews))]
    public async Task<IActionResult> GetReviews(Guid placeId, int page)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetReviewsQuery(placeId, page)));
}
