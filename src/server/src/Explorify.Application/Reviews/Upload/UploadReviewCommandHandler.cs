using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using static Explorify.Domain.Constants.ReviewConstants.ErrorMessages;
using static Explorify.Domain.Constants.ReviewConstants.SuccessMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.Upload;

public class UploadReviewCommandHandler
    : ICommandHandler<UploadReviewCommand>
{
    private readonly IRepository _repository;
    private readonly IBlobService _blobService;

    public UploadReviewCommandHandler(
        IRepository repository,
        IBlobService blobService)
    {
        _repository = repository;
        _blobService = blobService;
    }

    public async Task<Result> Handle(
        UploadReviewCommand request,
        CancellationToken cancellationToken)
    {
        //var place = await _repository.GetByIdAsync<Place>(request.Model.PlaceId);

        var place = await _repository
            .AllAsNoTracking<Place>()
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == request.Model.PlaceId, cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (place.UserId == request.Model.UserId)
        {
            var error = new Error(UserReviewOwnPlaceError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var userReview = await _repository
            .AllAsNoTracking<Review>()
            .FirstOrDefaultAsync(x =>
                x.UserId == request.Model.UserId && x.PlaceId == request.Model.PlaceId,
                cancellationToken);

        if (userReview is not null)
        {
            var error = new Error(UserReviewAlreadyExistsError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var photos = new List<ReviewPhoto>();

        foreach (var file in request.Model.Files)
        {
            var url = await _blobService.UploadBlobAsync(
                file.Content,
                file.FileName,
                $"ReviewsImages/${place.Category.Name}/{place.Name}/");

            photos.Add(new ReviewPhoto { Url = url });
        }

        var review = new Review
        {
            Photos = photos,
            PlaceId = place.Id,
            UserId = request.Model.UserId,
            Content = request.Model.Content,
            Rating = (short)request.Model.Rating,
        };

        await _repository.AddAsync(review);
        await _repository.SaveChangesAsync();

        return Result.Success(ReviewUploadSuccess);
    }
}
