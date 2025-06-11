using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Place.Upload;

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
        var model = request.Model;

        var category = await GetCategoryWithSubcategoriesAsync(
            model.CategoryId,
            cancellationToken);

        if (category is null)
        {
            return ValidationError("No category with given id found!");
        }

        var subcategory = category.Children.FirstOrDefault(x => x.Id == model.SubcategoryId);

        if (subcategory is null)
        {
            return ValidationError("No subcategory with given id found in the specified category!");
        }

        var country = await _repository.GetByIdAsync<Domain.Entities.Country>(model.CountryId);

        if (country is null)
        {
            return ValidationError("No country with given id found!");
        }

        bool areTagsValid = await AreTagsValidAsync(model.VibesIds, cancellationToken);

        if (areTagsValid is false)
        {
            return ValidationError("One or more provided tags do not exist.");
        }

        var review = new Review
        {
            UserId = model.UserId,
            Rating = (short)model.ReviewRating,
            Content = model.ReviewContent
        };

        var place = new Domain.Entities.Place
        {
            Name = model.Name,
            UserId = model.UserId,
            CountryId = model.CountryId,
            Description = model.Description,
            CategoryId = model.SubcategoryId,
            Reviews = new List<Review> { review },
            SlugifiedName = _slugGenerator.GenerateSlug(model.Name)
        };

        await AssignCoordinatesIfMissingAsync(place, model, country.Name);

        place.AssignTags(model.VibesIds);

        var urls = await UploadPlaceImagesAsync(model, category.Name, subcategory.Name);
        var thumb = urls.First(url => Path.GetFileName(url).StartsWith("thumb_"));
        var others = urls.Where(url => !Path.GetFileName(url).StartsWith("thumb_"));

        place.AssignPhotos(thumb, others);

        await _repository.AddAsync(place);
        await _repository.SaveChangesAsync();

        return Result.Success(PlaceUploadSuccess);
    }

    private async Task<Category?> GetCategoryWithSubcategoriesAsync(int id, CancellationToken ct)
    {
        return await _repository.AllAsNoTracking<Category>()
            .Include(c => c.Children)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    private async Task<bool> AreTagsValidAsync(IEnumerable<int> ids, CancellationToken ct)
    {
        var valid = await _repository.AllAsNoTracking<PlaceVibe>()
            .Select(v => v.Id)
            .ToListAsync(ct);

        return ids.All(valid.Contains);
    }

    private async Task AssignCoordinatesIfMissingAsync(
        Domain.Entities.Place place,
        UploadPlaceRequestModel model,
        string countryName)
    {
        if (model.Latitude is > 0 and <= 90 && model.Longitude is > 0 and <= 180)
        {
            place.AssignCoordinates(model.Latitude, model.Longitude);
            return;
        }

        var fullAddress = string.IsNullOrWhiteSpace(model.Address)
            ? $"{model.Name}, {countryName}"
            : $"{model.Name}, {model.Address}, {countryName}";

        var coords = await _geocodingService.GetCoordinatesAsync(fullAddress);

        if (coords is not null)
        {
            place.AssignCoordinates(
                (decimal)coords.Latitude,
                (decimal)coords.Longitude);
        }
    }

    private async Task<List<string>> UploadPlaceImagesAsync(
        UploadPlaceRequestModel model,
        string category,
        string subcategory)
    {
        var files = await _imageService.ProcessPlaceImagesAsync(model.Files);

        var path = $"PlacesImages/{category}/{subcategory}/{model.Name}/";

        var tasks = files.Select(file => _blobService.UploadBlobAsync(
            file.Content,
            file.FileName,
            path));

        return [.. (await Task.WhenAll(tasks))];
    }

    private static Result ValidationError(string message) =>
        Result.Failure(new Error(message, ErrorType.Validation));

}
