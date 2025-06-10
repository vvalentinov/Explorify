using Explorify.Application.Vibes;

namespace Explorify.Application.Place;

public class PlaceDetailsResponseModel
{
    public Guid Id { get; set; }

    public double AvgRating { get; set; } = 0.0;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SlugifiedName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public bool IsFavPlace { get; set; }

    public Guid UserId { get; set; }

    public string UserProfileImageUrl { get; set; } = string.Empty;

    public int UserReviewRating { get; set; }

    public string UserReviewContent { get; set; } = string.Empty;

    public List<string> ImagesUrls { get; set; } = [];

    public List<VibeResponseModel> Tags { get; set; } = [];

    public bool IsApproved { get; set; }

    public bool IsDeleted { get; set; }
}
