using Explorify.Api.DTOs;
using Explorify.Api.Extensions;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.Reviews.Delete;
using Explorify.Application.ReviewsLikes.Like;
using Explorify.Application.Reviews.GetReviews;
using Explorify.Application.ReviewsLikes.Dislike;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Application.Reviews.GetEditInfo;

namespace Explorify.Api.Controllers;

public class ReviewController : BaseController
{
    private readonly IMediator _mediator;

    public ReviewController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost(nameof(Upload))]
    public async Task<IActionResult> Upload(UploadReviewRequestDto model)
        => this.CreatedAtActionOrProblemDetails(
                await _mediator.Send(new UploadReviewCommand(model.ToApplicationModel(User.GetId()))),
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

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete(Guid reviewId)
    {
        var command = new DeleteReviewCommand(
            reviewId,
            User.GetId(),
            User.IsAdmin());

        var result = await _mediator.Send(command);

        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetEditInfo))]
    public async Task<IActionResult> GetEditInfo(Guid reviewId)
    {
        var query = new GetReviewEditInfoQuery(reviewId, User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
