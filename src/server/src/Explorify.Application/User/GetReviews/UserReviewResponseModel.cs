namespace Explorify.Application.User.GetReviews;

public class UserReviewResponseModel
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public int Likes { get; set; }

    public string PlaceName { get; set; } = string.Empty;

    public IEnumerable<string> ImagesUrls { get; set; } = [];
}
