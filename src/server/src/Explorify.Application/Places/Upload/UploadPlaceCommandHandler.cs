using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;
using static Explorify.Domain.Constants.CountryConstants.ErrorMessages;
using static Explorify.Domain.Constants.CategoryConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Upload;

public class UploadPlaceCommandHandler
    : ICommandHandler<UploadPlaceCommand>
{
    private readonly IRepository _repository;
    private readonly ISlugGenerator _slugGenerator;

    private readonly IBlobService _blobService;
    private readonly IImageService _imageService;
    private readonly IGeocodingService _geocodingService;

    public UploadPlaceCommandHandler(
        IRepository repository,
        ISlugGenerator slugGenerator,
        IBlobService blobService,
        IImageService imageService,
        IGeocodingService geocodingService)
    {
        _repository = repository;
        _slugGenerator = slugGenerator;

        _blobService = blobService;
        _imageService = imageService;
        _geocodingService = geocodingService;
    }

    public async Task<Result> Handle(
        UploadPlaceCommand request,
        CancellationToken cancellationToken)
    {
        UploadPlaceRequestModel model = request.Model;

        var category = await _repository
            .AllAsNoTracking<Category>()
            .Include(x => x.Children)
            .FirstOrDefaultAsync(x =>
                x.Id == model.CategoryId,
                cancellationToken);

        if (category == null)
        {
            var error = new Error(NoCategoryWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var subcategory = category.Children.FirstOrDefault(x => x.Id == model.SubcategoryId);

        if (subcategory == null)
        {
            var error = new Error(NoSubcategoryInGivenCategoryError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var country = await _repository.GetByIdAsync<Country>(model.CountryId);

        if (country == null)
        {
            var error = new Error(NoCountryWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var validTagsIds = await _repository
            .AllAsNoTracking<PlaceVibe>()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var tagsAreValid = model.VibesIds.All(validTagsIds.Contains);

        if (tagsAreValid == false)
        {
            var error = new Error("One or more provided tags do not exist.", ErrorType.Validation);
            return Result.Failure(error);
        }

        var review = new Review
        {
            UserId = model.UserId,
            Rating = (short)model.ReviewRating,
            Content = model.ReviewContent,
        };

        var place = new Place
        {
            Name = model.Name,
            UserId = model.UserId,
            CountryId = model.CountryId,
            Description = model.Description,
            CategoryId = model.SubcategoryId,
            Reviews = new List<Review> { review },
            SlugifiedName = _slugGenerator.GenerateSlug(model.Name),
        };

        bool latProvided = model.Latitude != null && model.Latitude != 0;
        bool longProvided = model.Longitude != null && model.Longitude != 0;

        if (!latProvided && !longProvided)
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
        else if (latProvided && longProvided)
        {
            place.Latitude = model.Latitude;
            place.Longitude = model.Longitude;
        }
        //else
        //{
        //    var error = new Error("Both latitude and longitude must be provided together or omitted.", ErrorType.Validation);
        //    return Result.Failure(error);
        //}

        var placeVibeAssignments = new List<PlaceVibeAssignment>();

        foreach (var tagId in model.VibesIds)
        {
            placeVibeAssignments.Add(new PlaceVibeAssignment
            {
                PlaceId = place.Id,
                PlaceVibeId = tagId,
            });
        }

        place.PlaceVibeAssignments = placeVibeAssignments;

        var placePhotos = new List<PlacePhoto>();

        var files = await _imageService.ProcessPlaceImagesAsync(model.Files);

        var uploadTasks = files.Select(file =>
            _blobService.UploadBlobAsync(
                file.Content,
                file.FileName,
                $"PlacesImages/{category.Name}/{subcategory.Name}/{model.Name}-{Guid.NewGuid()}/"));

        var urls = await Task.WhenAll(uploadTasks);

        var thumbUrl = urls.First(url => Path.GetFileName(url).StartsWith("thumb_"));
        var otherUrls = urls.Where(url => Path.GetFileName(url).StartsWith("thumb_") == false);

        foreach (var url in otherUrls)
        {
            placePhotos.Add(new PlacePhoto { Url = url });
        }

        place.ThumbUrl = thumbUrl;
        place.Photos = placePhotos;

        await _repository.AddAsync(place);
        await _repository.SaveChangesAsync();

        return Result.Success(PlaceUploadSuccess);
    }
}
