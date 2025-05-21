namespace Explorify.Api.DTOs;

public class UploadPlaceRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CountryId { get; set; }

    public int CategoryId { get; set; }

    public int SubcategoryId { get; set; }

    public int ReviewRating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public List<IFormFile> Files { get; set; } = new List<IFormFile>();

    public List<int> VibesIds { get; set; } = new List<int>();

    public string? Address { get; set; }
}
