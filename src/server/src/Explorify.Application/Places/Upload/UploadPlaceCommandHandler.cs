using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.AzureConstants;
using static Explorify.Domain.Constants.CountryConstants.ErrorMessages;
using static Explorify.Domain.Constants.CategoryConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Upload;

public class UploadPlaceCommandHandler
    : ICommandHandler<UploadPlaceCommand>
{
    private readonly IRepository _repository;
    private readonly IBlobService _blobService;
    private readonly IImageService _imageService;
    private readonly ISlugGenerator _slugGenerator;

    public UploadPlaceCommandHandler(
        IRepository repository,
        ISlugGenerator slugGenerator,
        IBlobService blobService,
        IImageService imageService)
    {
        _repository = repository;
        _blobService = blobService;
       _imageService = imageService;
        _slugGenerator = slugGenerator;
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
                x.Id == model.CategoryId, cancellationToken);

        if (category == null)
        {
            return Result.Failure(new Error(NoCategoryWithIdError, ErrorType.Validation));
        }

        if (category.Children.Any(x => x.Id == model.SubcategoryId) == false)
        {
            return Result.Failure(new Error(NoSubcategoryInGivenCategoryError, ErrorType.Validation));
        }

        var country = await _repository.GetByIdAsync<Country>(model.CountryId);

        if (country == null)
        {
            return Result.Failure(new Error(NoCountryWithIdError, ErrorType.Validation));
        }

        var placePhotos = new List<PlacePhoto>();

        //var urls = await _imageService.ProcessPlaceImagesAsync(model.Name, model.Files);

        //foreach (var url in urls)
        //{
        //    placePhotos.Add(new PlacePhoto { Url = url });
        //}

        //var files = await _imageService.ProcessPlaceImagesAsync(model.Files);

        //foreach (var file in files)
        //{
        //    var url = await _blobService.UploadBlobAsync(
        //        file.Content,
        //        file.FileName,
        //        $"PlaceImages/${model.Name}/");
        //}

        var files = await _imageService.ProcessPlaceImagesAsync(model.Files);

        var uploadTasks = files.Select(file =>
            _blobService.UploadBlobAsync(
                file.Content,
                file.FileName,
                $"PlacesImages/{model.Name}/"));

        var urls = await Task.WhenAll(uploadTasks);

        foreach (var url in urls)
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
            Name = model.Name,
            SlugifiedName = _slugGenerator.GenerateSlug(model.Name),
            Description = model.Description,
            CountryId = model.CountryId,
            CategoryId = model.SubcategoryId,
            UserId = model.UserId,
            Photos = placePhotos,
            Reviews = new List<Review> { review },
        };

        await _repository.AddAsync(place);
        await _repository.SaveChangesAsync();

        return Result.Success("Successfull place upload!");
    }
}
