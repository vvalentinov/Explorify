using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Places;

public class EditPlaceRequestModel
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

    public List<int> ToBeRemovedImagesIds { get; set; } = new();

    public List<UploadFile> NewImages { get; set; } = new();

    public Guid UserId { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public List<int> TagsIds { get; set; } = new();
}
