using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

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
        _blobService = blobService;
        _imageService = imageService;
        _slugGenerator = slugGenerator;
        _geocodingService = geocodingService;
    }

    public async Task<Result> Handle(
        UploadPlaceCommand request,
        CancellationToken cancellationToken)
    {
        UploadPlaceRequestModel model = request.Model;

        bool placeWithNameExists = await _repository
            .AllAsNoTracking<Place>()
            .AnyAsync(x => EF.Functions.Like(x.Name, model.Name), cancellationToken);

        if (placeWithNameExists)
        {
            var error = new Error("Place with given name already exists!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var category = await _repository
            .AllAsNoTracking<Category>()
            .Include(x => x.Children)
            .FirstOrDefaultAsync(x =>
                x.Id == model.CategoryId, cancellationToken);

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

        var existingTags = await _repository
            .AllAsNoTracking<PlaceVibe>()
            .Where(t => model.VibesIds.Contains(t.Id))
            .ToListAsync(cancellationToken);

        if (existingTags.Count != model.VibesIds.Count)
        {
            var error = new Error("One or more provided tags do not exist.", ErrorType.Validation);
            return Result.Failure(error);
        }

        var placePhotos = new List<PlacePhoto>();

        var files = await _imageService.ProcessPlaceImagesAsync(model.Files);

        var uploadTasks = files.Select(file =>
            _blobService.UploadBlobAsync(
                file.Content,
                file.FileName,
                $"PlacesImages/{category.Name}/{subcategory.Name}/{model.Name}/"));

        var urls = await Task.WhenAll(uploadTasks);

        var thumbUrl = urls.First(url => Path.GetFileName(url).StartsWith("thumb_"));
        var otherUrls = urls.Where(url => Path.GetFileName(url).StartsWith("thumb_") == false);

        foreach (var url in otherUrls)
        {
            placePhotos.Add(new PlacePhoto { Url = url });
        }

        var review = new Review
        {
            UserId = model.UserId,
            Rating = (short)model.ReviewRating,
            Content = model.ReviewContent,
        };

        var place = new Place
        {
            ThumbUrl = thumbUrl,
            Name = model.Name,
            Photos = placePhotos,
            UserId = model.UserId,
            CountryId = model.CountryId,
            Description = model.Description,
            CategoryId = model.SubcategoryId,
            Reviews = new List<Review> { review },
            SlugifiedName = _slugGenerator.GenerateSlug(model.Name),
        };

        var placeVibeAssignments = new List<PlaceVibeAssignment>();

        foreach (var item in existingTags)
        {
            placeVibeAssignments.Add(new PlaceVibeAssignment
            {
                PlaceId = place.Id,
                PlaceVibeId = item.Id,
            });
        }

        place.PlaceVibeAssignments = placeVibeAssignments;

        if (model.Latitude == 0 && model.Longitude == 0)
        {
            string fullAddress;

            if (request.Model.Address != null &&
                string.IsNullOrWhiteSpace(request.Model.Address) == false)
            {
                fullAddress = $"{model.Name}, {request.Model.Address}, {country.Name}";
            }
            else
            {
                fullAddress = $"{model.Name}, {country.Name}";
            }

            var coordinates = await _geocodingService.GetCoordinatesAsync(fullAddress);

            if (coordinates != null)
            {
                place.Latitude = (decimal)coordinates.Latitude;
                place.Longitude = (decimal)coordinates.Longitude;
            }
        }

        await _repository.AddAsync(place);
        await _repository.SaveChangesAsync();

        return Result.Success("Successfull place upload! When an admin approves your place, you will receive a notification!");
    }
}
