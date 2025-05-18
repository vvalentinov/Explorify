namespace Explorify.Application.Places.GetEditData;

public class GetEditDataResponseModel
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public int CategoryId { get; set; }

    public int CountryId { get; set; }

    public string CountryName { get; set; } = string.Empty;

    public int Rating { get; set; }

    public string ReviewContent { get; set; } = string.Empty;

    public List<ImageResponseModel> Images { get; set; } = new();
}
