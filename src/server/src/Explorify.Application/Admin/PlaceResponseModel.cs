namespace Explorify.Application.Admin;

public class PlaceResponseModel
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string CountryName { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ReviewContent { get; set; } = string.Empty;

    public int ReviewStars { get; set; }

    public IEnumerable<string> ImagesUrls { get; set; } = [];

    public string UserName { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public string UserProfilePicUrl { get; set; } = string.Empty;

    public string ThumbUrl { get; set; } = string.Empty;
}
