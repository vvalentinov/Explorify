using Explorify.Api.Extensions;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.ReviewsLikes.Like;
using Explorify.Application.Reviews.GetReviews;
using Explorify.Application.ReviewsLikes.Dislike;

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
    public async Task<IActionResult> GetReviews([FromQuery] GetReviewsRequestModel model)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetReviewsQuery(model, User.GetId())));

    [HttpPost(nameof(Like))]
    public async Task<IActionResult> Like([FromQuery] Guid reviewId)
        => this.CreatedAtActionOrProblemDetails(
                await _mediator.Send(
                    new LikeReviewCommand(reviewId, User.GetId())), nameof(Like));

    [HttpDelete(nameof(Dislike))]
    public async Task<IActionResult> Dislike([FromQuery] Guid reviewId)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new DislikeReviewCommand(reviewId, User.GetId())));
}
