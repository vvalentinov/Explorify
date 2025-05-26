namespace Explorify.Application.Place.Edit.GetEditData;

public class GetEditDataResponseModel
{
    public Guid PlaceId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public int CategoryId { get; set; }

    public int CountryId { get; set; }

    public string CountryName { get; set; } = string.Empty;

    public int Rating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public List<ImageResponseModel> Images { get; set; } = new();

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public List<int> TagsIds { get; set; } = new();
}
