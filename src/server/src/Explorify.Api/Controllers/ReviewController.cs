using Explorify.Api.DTOs;
using Explorify.Infrastructure;
using Explorify.Api.Extensions;
using Explorify.Application.Reviews.Edit;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.Reviews.Delete;
using Explorify.Application.Reviews.Revert;
using Explorify.Application.ReviewsLikes.Like;
using Explorify.Application.Reviews.GetReviews;
using Explorify.Application.Reviews.GetEditInfo;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.ReviewsLikes.Dislike;
using Explorify.Application.Reviews.GetReviews.Deleted;
using Explorify.Application.Reviews.GetReviews.ForPlace;
using Explorify.Application.Reviews.GetReviews.Approved;
using Explorify.Application.Reviews.GetReviews.Unapproved;

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
    public async Task<IActionResult> Upload(UploadReviewRequestDto model)
    {
        var applicationModel = await model.ToApplicationModelAsync(User.GetId());
        var command = new UploadReviewCommand(applicationModel);
        var result = await _mediator.Send(command);
        return this.CreatedAtActionOrProblemDetails(result, nameof(Upload));
    }

    [HttpGet(nameof(GetEditInfo))]
    public async Task<IActionResult> GetEditInfo(Guid reviewId)
    {
        var query = new GetReviewEditInfoQuery(reviewId, User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(Edit))]
    public async Task<IActionResult> Edit([FromForm] EditReviewRequestDto model)
    {
        var applicationModel = await model.ToApplicationModelAsync();
        var command = new EditReviewCommand(applicationModel, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPost(nameof(Like))]
    public async Task<IActionResult> Like([FromQuery] Guid reviewId)
    {
        var command = new LikeReviewCommand(reviewId, User.GetId());
        var result = await _mediator.Send(command);
        return this.CreatedAtActionOrProblemDetails(result, nameof(Like));
    }

    [HttpDelete(nameof(Dislike))]
    public async Task<IActionResult> Dislike([FromQuery] Guid reviewId)
    {
        var command = new DislikeReviewCommand(reviewId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(Revert))]
    public async Task<IActionResult> Revert(Guid reviewId)
    {
        var command = new RevertReviewCommand(
            reviewId,
            User.GetId(), 
            User.IsAdmin());

        var result = await _mediator.Send(command);

        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete(DeleteReviewRequestDto model)
    {
        var command = new DeleteReviewCommand(
            model,
            User.GetId(),
            User.IsAdmin());

        var result = await _mediator.Send(command);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetReviewsForPlace))]
    public async Task<IActionResult> GetReviewsForPlace(
        Guid placeId,
        [FromQuery] ReviewsOrderEnum order,
        int page = 1)
    {
        var query = new GetReviewsForPlaceQuery(
            placeId,
            page,
            order,
            User.GetId());

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [PageValidationFilter]
    [HttpGet(nameof(GetApproved))]
    public async Task<IActionResult> GetApproved(bool isForAdmin, int page)
    {
        if (!User.IsAdmin() && isForAdmin)
        {
            var error = new Error("Only admins can access all approved reviews.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new GetApprovedReviewsQuery(
            User.GetId(),
            User.IsAdmin(),
            page,
            isForAdmin);

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [PageValidationFilter]
    [HttpGet(nameof(GetUnapproved))]
    public async Task<IActionResult> GetUnapproved(bool isForAdmin, int page = 1)
    {
        if (!User.IsAdmin() && isForAdmin)
        {
            var error = new Error("Only admins can access all unapproved reviews.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new GetUnapprovedReviewsQuery(
            User.GetId(),
            User.IsAdmin(),
            page,
            isForAdmin);

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [PageValidationFilter]
    [HttpGet(nameof(GetDeleted))]
    public async Task<IActionResult> GetDeleted(bool isForAdmin, int page = 1)
    {
        if (!User.IsAdmin() && isForAdmin)
        {
            var error = new Error("Only admins can access all recently deleted reviews.", ErrorType.Validation);
            return this.OkOrProblemDetails(Result.Failure(error));
        }

        var query = new GetDeletedReviewsQuery(
            User.GetId(),
            User.IsAdmin(),
            page,
            isForAdmin);

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }
}
