using Explorify.Application.Places;
using Explorify.Infrastructure.Binders;
using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.DTOs;

public class EditPlaceRequestDto
{
    public Guid PlaceId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Address { get; set; }

    public int CategoryId { get; set; }

    public int SubcategoryId { get; set; }

    public int CountryId { get; set; }

    public int ReviewRating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    public List<int> ToBeRemovedImagesIds { get; set; } = new();

    public List<int> TagsIds { get; set; } = new();


    [ModelBinder(BinderType = typeof(UploadFileListModelBinder))]
    public List<UploadFile> NewImages { get; set; } = new();

    public EditPlaceRequestModel ToApplicationModel(Guid userId) => new EditPlaceRequestModel
    {
        PlaceId = PlaceId,
        Name = Name,
        Description = Description,
        Address = Address ?? string.Empty,
        CategoryId = CategoryId,
        SubcategoryId = SubcategoryId,
        CountryId = CountryId,
        ReviewRating = ReviewRating,
        ReviewContent = ReviewContent,
        ToBeRemovedImagesIds = ToBeRemovedImagesIds,
        NewImages = NewImages,
        Latitude = Latitude,
        Longitude = Longitude,
        UserId = userId,
        TagsIds = TagsIds,
    };
}
