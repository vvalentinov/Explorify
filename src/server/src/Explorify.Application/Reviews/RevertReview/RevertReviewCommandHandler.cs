using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.RevertReview;

public class RevertReviewCommandHandler
    : ICommandHandler<RevertReviewCommand>
{
    private readonly IRepository _repository;

    public RevertReviewCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        RevertReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.ReviewId;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrentUserAdmin;

        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var review = await _repository
            .All<Review>(withDeleted: true)
            .Where(x =>
                x.IsDeleted &&
                !x.Place.IsDeleted &&
                x.DeletedOn >= cutoff &&
                (x.UserId == currUserId || isCurrUserAdmin))
            .FirstOrDefaultAsync(
                x => x.Id == reviewId,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review was found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        review.IsApproved = false;
        review.IsDeleted = false;
        review.DeletedOn = null;

        _repository.Update(review);

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully reverterd review!");
    }
}
