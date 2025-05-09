using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.ReviewsLikes.Like;

public class LikeReviewCommandHandler
    : ICommandHandler<LikeReviewCommand, ReviewLikesResponseModel>
{
    private readonly IRepository _repository;

    public LikeReviewCommandHandler(
        IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<ReviewLikesResponseModel>> Handle(
        LikeReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.ReviewId;
        var userId = request.UserId;

        var review = await _repository
            .AllAsNoTracking<Review>()
            .Include(x => x.ReviewLikes)
            .FirstOrDefaultAsync(x => x.Id == reviewId, cancellationToken);

        if (review is null)
        {
            var error = new Error("No review with id found!", ErrorType.Validation);
            return Result.Failure<ReviewLikesResponseModel>(error);
        }

        if (review.UserId == userId)
        {
            var error = new Error("User cannot like or dislike their own reviews!", ErrorType.Validation);
            return Result.Failure<ReviewLikesResponseModel>(error);
        }

        bool hasUserLikedReview = review
            .ReviewLikes
            .Any(x => x.UserId == userId);

        if (hasUserLikedReview)
        {
            var error = new Error("User has already liked this review!", ErrorType.Validation);
            return Result.Failure<ReviewLikesResponseModel>(error);
        }

        var reviewLike = new Domain.Entities.ReviewsLikes
        {
            UserId = userId,
            ReviewId = reviewId
        };

        await _repository.AddAsync(reviewLike);

        review.Likes++;
        _repository.Update(review);

        await _repository.SaveChangesAsync();

        var response = new ReviewLikesResponseModel { Likes = review.Likes };

        return Result.Success(response, "Successfully liked the review!");
    }
}
