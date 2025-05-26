using Explorify.Api.DTOs;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Place.Edit;
using Explorify.Application.Place.Upload;

namespace Explorify.Api.Extensions;

public static class DTOsExtensions
{
    public static async Task<UploadPlaceRequestModel> ToApplicationModelAsync(
        this UploadPlaceRequestDto dto,
        Guid UserId)
    {
        var model = new UploadPlaceRequestModel
        {
            Address = dto.Address,
            CategoryId = dto.CategoryId,
            CountryId = dto.CountryId,
            Description = dto.Description,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Name = dto.Name,
            ReviewContent = dto.ReviewContent,
            ReviewRating = dto.ReviewRating,
            SubcategoryId = dto.SubcategoryId,
            VibesIds = dto.VibesIds,
            Files = await MapFilesAsync(dto.Files),
            UserId = UserId,
        };

        return model;
    }

    public static async Task<EditPlaceRequestModel> ToApplicationModelAsync(
        this EditPlaceRequestDto dto,
        Guid UserId)
    {
        var model = new EditPlaceRequestModel
        {
            Address = dto.Address,
            CategoryId = dto.CategoryId,
            CountryId = dto.CountryId,
            Description = dto.Description,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Name = dto.Name,
            ReviewContent = dto.ReviewContent,
            ReviewRating = dto.ReviewRating,
            SubcategoryId = dto.SubcategoryId,
            TagsIds = dto.TagsIds,
            NewImages = await MapFilesAsync(dto.NewImages),
            UserId = UserId,
            PlaceId = dto.PlaceId,
            ToBeRemovedImagesIds = dto.ToBeRemovedImagesIds,
        };

        return model;
    }

    private static async Task<List<UploadFile>> MapFilesAsync(List<IFormFile> files)
    {
        var uploadFileTasks = files.Select(async file =>
        {
            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            return new UploadFile
            {
                Content = memoryStream,
                FileName = file.FileName,
                ContentType = file.ContentType,
            };
        });

        var uploadFiles = await Task.WhenAll(uploadFileTasks);

        return [.. uploadFiles];
    }
}
