using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Places.Upload;

public class UploadPlaceRequestModel
{
    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CountryId { get; set; }

    public int CategoryId { get; set; }

    public int SubcategoryId { get; set; }

    public int ReviewRating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public List<UploadFile> Files { get; set; } = [];

    public List<int> VibesIds { get; set; } = [];
}
