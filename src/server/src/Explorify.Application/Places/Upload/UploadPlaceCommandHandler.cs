using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.CountryConstants;
using static Explorify.Domain.Constants.CategoryConstants;
using static Explorify.Domain.Constants.AzureBlobStorageConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Upload;

public class UploadPlaceCommandHandler
    : ICommandHandler<UploadPlaceCommand>
{
    private readonly IRepository _repository;
    private readonly IBlobService _blobService;

    public UploadPlaceCommandHandler(
        IRepository repository,
        IBlobService blobService)
    {
        _repository = repository;
        _blobService = blobService;
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

        foreach (var file in model.Files)
        {
            var url = await _blobService.UploadBlobAsync(
                file.Content,
                file.FileName,
                PlacesImagesPath);

            placePhotos.Add(new PlacePhoto { Url = url });
        }

        var place = new Place
        {
            Name = model.Name,
            Description = model.Description,
            CountryId = model.CountryId,
            CategoryId = model.SubcategoryId,
            UserId = model.UserId,
            Photos = placePhotos,
        };

        await _repository.AddAsync(place);
        await _repository.SaveChangesAsync();

        return Result.Success();
    }
}
