using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Domain.Constants.CountryConstants.ErrorMessages;
using static Explorify.Domain.Constants.CategoryConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Update;

public class UpdatePlaceCommandHandler
    : ICommandHandler<UpdatePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IBlobService _blobService;
    private readonly IImageService _imageService;
    private readonly IGeocodingService _geocodingService;

    public UpdatePlaceCommandHandler(
        IRepository repository,
        IBlobService blobService,
        IImageService imageService,
        IGeocodingService geocodingService)
    {
        _repository = repository;

        _blobService = blobService;
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
            .FirstOrDefaultAsync(x =>
                x.Id == request.Model.PlaceId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
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

        var files = await _imageService.ProcessPlaceImagesAsync(request.Model.NewImages);

        var uploadTasks = files.Select(file =>
            _blobService.UploadBlobAsync(
                file.Content,
                file.FileName,
                $"PlacesImages/{category.Name}/{subcategory.Name}/{request.Model.Name}/"));

        var urls = await Task.WhenAll(uploadTasks);

        var thumbUrl = urls.First(url => Path.GetFileName(url).StartsWith("thumb_"));
        var otherUrls = urls.Where(url => Path.GetFileName(url).StartsWith("thumb_") == false);

        var placePhotos = new List<PlacePhoto>();

        foreach (var url in otherUrls)
        {
            placePhotos.Add(new PlacePhoto { Url = url });
        }

        foreach (var imageIdToBeRemoved in request.Model.ToBeRemovedImagesIds)
        {
            var photo = place.Photos.FirstOrDefault(x => x.Id == imageIdToBeRemoved);

            // TODO: remove the image from blob storage

            if (photo != null)
            {
                _repository.SoftDelete(photo);
            }
        }

        // TODO: add place tags here also

        string fullAddress;

        if (request.Model.Address != null &&
            string.IsNullOrWhiteSpace(request.Model.Address) == false)
        {
            fullAddress = $"{request.Model.Name}, {request.Model.Address}, {country.Name}";
        }
        else
        {
            fullAddress = $"{request.Model.Name}, {country.Name}";
        }

        var coordinates = await _geocodingService.GetCoordinatesAsync(fullAddress);

        if (coordinates != null)
        {
            place.Latitude = (decimal)coordinates.Latitude;
            place.Longitude = (decimal)coordinates.Longitude;
        }

        var userReview = await _repository
            .All<Review>()
            .FirstAsync(x =>
                x.PlaceId == request.Model.PlaceId &&
                x.UserId == request.Model.UserId,
                cancellationToken);

        userReview.Rating = (short)request.Model.ReviewRating;
        userReview.Content = request.Model.ReviewContent;

        _repository.Update(userReview);

        place.Name = request.Model.Name;
        place.Description = request.Model.Description;
        place.Address = request.Model.Address;
        place.CategoryId = request.Model.SubcategoryId;
        place.CountryId = request.Model.CountryId;
        place.ThumbUrl = thumbUrl;
        place.Photos = placePhotos;

        _repository.Update(place);
        await _repository.SaveChangesAsync();

        return Result.Success();
    }
}
