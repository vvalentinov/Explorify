using Explorify.Domain.Entities;
using Explorify.Application.Places.GetEditData;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;
using static Explorify.Domain.Constants.CountryConstants.ErrorMessages;
using static Explorify.Domain.Constants.CategoryConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Update;

public class UpdatePlaceCommandHandler
    : ICommandHandler<UpdatePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IBlobService _blobService;
    private readonly IUserService _userService;
    private readonly IImageService _imageService;
    private readonly IGeocodingService _geocodingService;

    public UpdatePlaceCommandHandler(
        IRepository repository,
        IBlobService blobService,
        IUserService userService,
        IImageService imageService,
        IGeocodingService geocodingService)
    {
        _repository = repository;

        _blobService = blobService;
        _userService = userService;
        _imageService = imageService;
        _geocodingService = geocodingService;
    }

    public async Task<Result> Handle(
        UpdatePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .All<Place>()
            .Include(x => x.Photos)
            .Include(x => x.PlaceVibeAssignments)
            .FirstOrDefaultAsync(x =>
                x.Id == request.Model.PlaceId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (place.UserId != request.Model.UserId)
        {
            var error = new Error(EditError, ErrorType.Validation);
            return Result.Failure<GetEditDataResponseModel>(error);
        }

        var category = await _repository
            .AllAsNoTracking<Category>()
            .Include(x => x.Children)
            .FirstOrDefaultAsync(x =>
                x.Id == request.Model.CategoryId,
                cancellationToken);

        if (category == null)
        {
            var error = new Error(NoCategoryWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var subcategory = category
            .Children
            .FirstOrDefault(x => x.Id == request.Model.SubcategoryId);

        if (subcategory == null)
        {
            var error = new Error(NoSubcategoryInGivenCategoryError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var country = await _repository.GetByIdAsync<Country>(request.Model.CountryId);

        if (country == null)
        {
            var error = new Error(NoCountryWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        foreach (var imageIdToBeRemoved in request.Model.ToBeRemovedImagesIds)
        {
            var photo = place.Photos.FirstOrDefault(x => x.Id == imageIdToBeRemoved);

            if (photo != null)
            {
                await _blobService.DeleteBlobAsync(photo.Url);
                _repository.SoftDelete(photo);
            }
        }

        if (request.Model.NewImages.Count > 0)
        {
            var files = await _imageService.ProcessPlaceImagesAsync(request.Model.NewImages);

            var uploadTasks = files.Select(file =>
                _blobService.UploadBlobAsync(
                    file.Content,
                    file.FileName,
                    $"PlacesImages/{category.Name}/{subcategory.Name}/{place.Name}/"));

            var urls = await Task.WhenAll(uploadTasks);

            var thumbUrl = urls.First(url => Path.GetFileName(url).StartsWith("thumb_"));
            var otherUrls = urls.Where(url => Path.GetFileName(url).StartsWith("thumb_") == false);

            place.ThumbUrl = thumbUrl;

            foreach (var url in otherUrls)
            {
                place.Photos.Add(new PlacePhoto { Url = url });
            }

        }

        place.PlaceVibeAssignments.Clear();

        var validTagsIds = _repository
            .AllAsNoTracking<PlaceVibe>()
            .Select(x => x.Id)
            .ToHashSet();

        foreach (var tagId in request.Model.TagsIds)
        {
            if (validTagsIds.Contains(tagId))
            {
                place.PlaceVibeAssignments.Add(new PlaceVibeAssignment() { PlaceVibeId = tagId });
            }
        }

        var latProvided = request.Model.Latitude.HasValue;
        var lngProvided = request.Model.Longitude.HasValue;

        if (latProvided ^ lngProvided)
        {
            var error = new Error("Both Latitude and Longitude must be provided together.", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (!latProvided && !lngProvided)
        {
            string fullAddress = !string.IsNullOrWhiteSpace(request.Model.Address)
                ? $"{request.Model.Name}, {request.Model.Address}, {country.Name}"
                : $"{request.Model.Name}, {country.Name}";

            var coordinates = await _geocodingService.GetCoordinatesAsync(fullAddress);

            if (coordinates != null)
            {
                place.Latitude = (decimal)coordinates.Latitude;
                place.Longitude = (decimal)coordinates.Longitude;
            }
        }
        else
        {
            place.Latitude = request.Model.Latitude;
            place.Longitude = request.Model.Longitude;
        }

        var userReview = await _repository
            .All<Review>()
            .FirstAsync(x =>
                x.PlaceId == request.Model.PlaceId &&
                x.UserId == request.Model.UserId,
                cancellationToken);

        userReview.IsApproved = false;
        userReview.Content = request.Model.ReviewContent;
        userReview.Rating = (short)request.Model.ReviewRating;

        place.IsApproved = false;
        place.Name = request.Model.Name;
        place.Address = request.Model.Address;
        place.CountryId = request.Model.CountryId;
        place.Description = request.Model.Description;
        place.CategoryId = request.Model.SubcategoryId;

        await _userService.DecreaseUserPointsAsync(
            place.UserId.ToString(),
            UserPlaceUploadPoints);

        _repository.Update(userReview);
        _repository.Update(place);

        await _repository.SaveChangesAsync();

        return Result.Success(PlaceEditSuccess);
    }
}
