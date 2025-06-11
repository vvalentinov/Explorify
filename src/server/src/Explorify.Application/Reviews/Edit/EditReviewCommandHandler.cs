using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.Edit;

public class EditReviewCommandHandler
    : ICommandHandler<EditReviewCommand>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;
    private readonly IBlobService _blobService;

    public EditReviewCommandHandler(
        IRepository repository,
        IBlobService blobService,
        IUserService userService)
    {
        _repository = repository;
        _blobService = blobService;
        _userService = userService;
    }

    public async Task<Result> Handle(
        EditReviewCommand request,
        CancellationToken cancellationToken)
    {
        var model = request.Model;
        var currUserId = request.CurrentUserId;

        var review = await _repository
            .All<Review>()
            .Include(x => x.Place)
            .ThenInclude(x => x.Category)
            .Include(x => x.Photos)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x =>
                x.Id == model.Id,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (review.UserId != currUserId)
        {
            var error = new Error("Only review owner can edit this review!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var validImageIds = review
          .Photos
          .Where(x => !x.IsDeleted)
          .Select(x => x.Id)
          .ToHashSet();

        var invalidImageIds = model.ToBeRemovedImagesIds
            .Where(imageId => !validImageIds.Contains(imageId))
            .ToList();

        if (invalidImageIds.Count != 0)
        {
            var error = new Error("One or more image IDs to be deleted are invalid.", ErrorType.Validation);
            return Result.Failure(error);
        }

        int totalAfterEdit = validImageIds.Count - model.ToBeRemovedImagesIds.Count + model.NewImages.Count;

        if (totalAfterEdit > 5)
        {
            var error = new Error("A review cannot have more than 5 images.", ErrorType.Validation);
            return Result.Failure(error);
        }

        foreach (var imageIdToBeRemoved in model.ToBeRemovedImagesIds)
        {
            var photo = review.Photos.First(x => x.Id == imageIdToBeRemoved);

            _repository.SoftDelete(photo);
            await _blobService.DeleteBlobAsync(photo.Url);
        }

        if (model.NewImages.Count > 0)
        {
            var uploadTasks = model.NewImages.Select(file =>
                _blobService.UploadBlobAsync(
                    file.Content,
                    file.FileName,
                    $"ReviewsImages/{review.Place.Category.Name}/{review.Place.Name}/"));

            var urls = await Task.WhenAll(uploadTasks);

            foreach (var url in urls)
            {
                review.Photos.Add(new ReviewPhoto { Url = url });
            }
        }

        review.Rating = (short)model.Rating;
        review.Content = model.Content;

        if (review.IsApproved)
        {
            review.IsApproved = false;

            await _userService.DecreaseUserPointsAsync(currUserId, 5);
        }

        _repository.Update(review);

        await _repository.SaveChangesAsync();

        return Result.Success("Successfull review edit! When an admin approves your edit request, the review will become visible on the site!");
    }
}
