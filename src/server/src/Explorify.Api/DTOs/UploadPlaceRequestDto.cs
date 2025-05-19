using Explorify.Infrastructure.Binders;
using Explorify.Application.Places.Upload;
using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.DTOs;

public class UploadPlaceRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public int CountryId { get; set; }

    public int CategoryId { get; set; }

    public int SubcategoryId { get; set; }

    public int ReviewRating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    [ModelBinder(BinderType = typeof(UploadFileListModelBinder))]
    public List<UploadFile> Files { get; set; } = [];

    public List<int> VibesIds { get; set; } = [];

    public UploadPlaceRequestModel ToApplicationModel(Guid userId) => new UploadPlaceRequestModel
    {
        Address = Address,
        CategoryId = CategoryId,
        CountryId = CountryId,
        Description = Description,
        Latitude = Latitude,
        Longitude = Longitude,
        Name = Name,
        ReviewContent = ReviewContent,
        ReviewRating = ReviewRating,
        SubcategoryId = SubcategoryId,
        UserId = userId,
        VibesIds = VibesIds,
    };
}
