using System.Text.Json;
using Explorify.Application.Vibes;

namespace Explorify.Application.Places;

public class PlaceDetailsResponseModel
{
    public Guid Id { get; set; }

    public PlaceCoordinates Coordinates { get; set; } = default!;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public string UserProfileImageUrl { get; set; } = string.Empty;

    public int UserReviewRating { get; set; }

    public string UserReviewContent { get; set; } = string.Empty;

    public IEnumerable<string> ImagesUrls { get; set; } = [];

    public JsonElement WeatherData { get; set; }

    public List<VibeResponseModel> Tags { get; set; } = [];
}
