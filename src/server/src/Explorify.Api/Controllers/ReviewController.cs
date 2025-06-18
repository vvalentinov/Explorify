using Explorify.Api.DTOs;
using Explorify.Api.Extensions;

using Explorify.Infrastructure;

using Explorify.Application;
using Explorify.Application.Reviews.Edit;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.Reviews.Delete;
using Explorify.Application.Reviews.Revert;
using Explorify.Application.ReviewsLikes.Like;
using Explorify.Application.Reviews.GetReviews;
using Explorify.Application.Reviews.GetEditInfo;
using Explorify.Application.ReviewsLikes.Dislike;
using Explorify.Application.Reviews.GetReviews.Deleted;
using Explorify.Application.Reviews.GetReviews.ForPlace;
using Explorify.Application.Reviews.GetReviews.Approved;
using Explorify.Application.Reviews.GetReviews.Unapproved;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Application.Reviews.GetReviews.ForFollowedUser;

namespace Explorify.Api.Controllers;

public class ReviewController : BaseController
{
    private readonly IMediator _mediator;

    public ReviewController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost(nameof(Upload))]
    public async Task<IActionResult> Upload([FromForm] UploadReviewRequestDto model)
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
        var command = new RevertReviewCommand(reviewId, User.GetId(), User.IsAdmin());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete(DeleteReviewRequestDto model)
    {
        var command = new DeleteReviewCommand(model, User.GetId(), User.IsAdmin());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetReviewsForPlace))]
    public async Task<IActionResult> GetReviewsForPlace(
        [FromQuery] Guid placeId,
        [FromQuery] OrderEnum order,
        [FromQuery] IEnumerable<int> starsFilter,
        [FromQuery] int page = 1)
    {
        var model = new PlaceReviewsRequestDto
        {
            Order = order,
            Page = page,
            PlaceId = placeId,
            StarsFilter = starsFilter
        };

        var query = new GetReviewsForPlaceQuery(User.GetId(), model);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [PageValidationFilter]
    [HttpGet(nameof(GetReviewsForFollowedUser))]
    public async Task<IActionResult> GetReviewsForFollowedUser(
        [FromQuery] Guid followingUserId,
        [FromQuery] OrderEnum order,
        [FromQuery] IEnumerable<int> starsFilter,
        [FromQuery] int page = 1)
    {
        var query = new GetReviewsForFollowedUserQuery(
            CurrentUserId: User.GetId(),
            FollowingUserId: followingUserId,
            Page: page,
            Order: order,
            StarsFilter: starsFilter);

        var result = await _mediator.Send(query);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetApproved))]
    public async Task<IActionResult> GetApproved(
        [FromQuery] bool isForAdmin,
        [FromQuery] OrderEnum order,
        [FromQuery] IEnumerable<int> starsFilter,
        [FromQuery] int page = 1)
    {
        var model = new ModeratedReviewsRequestDto
        {
            Order = order,
            Page = page,
            StarsFilter = starsFilter,
            IsForAdmin = isForAdmin,
        };

        var query = new GetApprovedReviewsQuery(User.GetId(), User.IsAdmin(), model);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetUnapproved))]
    public async Task<IActionResult> GetUnapproved(
        [FromQuery] bool isForAdmin,
        [FromQuery] OrderEnum order,
        [FromQuery] IEnumerable<int> starsFilter,
        [FromQuery] int page = 1)
    {
        var model = new ModeratedReviewsRequestDto
        {
            Order = order,
            Page = page,
            StarsFilter = starsFilter,
            IsForAdmin = isForAdmin,
        };

        var query = new GetUnapprovedReviewsQuery(User.GetId(), User.IsAdmin(), model);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [PageValidationFilter]
    [HttpGet(nameof(GetDeleted))]
    public async Task<IActionResult> GetDeleted(
        [FromQuery] bool isForAdmin,
        [FromQuery] OrderEnum order,
        [FromQuery] IEnumerable<int> starsFilter,
        [FromQuery] int page = 1)
    {
        var model = new ModeratedReviewsRequestDto
        {
            Order = order,
            Page = page,
            StarsFilter = starsFilter,
            IsForAdmin = isForAdmin,
        };

        var query = new GetDeletedReviewsQuery(User.GetId(), User.IsAdmin(), model);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
