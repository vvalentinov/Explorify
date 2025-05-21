namespace Explorify.Api.DTOs;

public class EditPlaceRequestDto
{
    public Guid UserId { get; set; }

    public Guid PlaceId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Address { get; set; }

    public int CategoryId { get; set; }

    public int SubcategoryId { get; set; }

    public int CountryId { get; set; }

    public int ReviewRating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public List<int> ToBeRemovedImagesIds { get; set; } = new();

    public List<int> TagsIds { get; set; } = new();

    public List<IFormFile> NewImages { get; set; } = new();
}
