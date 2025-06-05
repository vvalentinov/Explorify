using Explorify.Api.DTOs;
using Explorify.Application.Place.Edit;
using Explorify.Application.Place.Upload;
using Explorify.Application.Reviews.Edit;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.Abstractions.Models;

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

    public static async Task<UploadReviewRequestModel> ToApplicationModelAsync(
        this UploadReviewRequestDto dto,
        Guid UserId)
    {
        var model = new UploadReviewRequestModel
        {
            Content = dto.Content,
            Files = await MapFilesAsync(dto.Files),
            PlaceId = dto.PlaceId,
            Rating = dto.Rating,
            UserId = UserId,
        };

        return model;
    }

    public static async Task<EditReviewRequestModel> ToApplicationModelAsync(this EditReviewRequestDto dto)
    {
        var model = new EditReviewRequestModel
        {
            Id = dto.Id,
            Rating = dto.Rating,
            Content = dto.Content,
            NewImages = await MapFilesAsync(dto.NewImages),
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
