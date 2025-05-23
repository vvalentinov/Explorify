using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.Delete;

public class DeleteReviewCommandHandler
    : ICommandHandler<DeleteReviewCommand>
{
    private readonly IRepository _repository;

    public DeleteReviewCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        DeleteReviewCommand request,
        CancellationToken cancellationToken)
    {
        var reviewId = request.Reviewid;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrUserAdmin;

        var review = await _repository
            .All<Review>()
            .FirstOrDefaultAsync(x =>
                x.Id == reviewId, cancellationToken);

        if (review == null)
        {
            var error = new Error("No review found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.UserId != currUserId && !isCurrUserAdmin)
        {
            var error = new Error("Only review owner or admin can delete review!", ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.SoftDelete(review);

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully deleted review!");
    }
}
