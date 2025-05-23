namespace Explorify.Application.Admin.GetReviews;

public class AdminReviewResponseModel
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public int Likes { get; set; }

    public string PlaceName { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public string? ProfileImageUrl { get; set; }

    public string UserName { get; set; } = default!;

    public IEnumerable<string> ImagesUrls { get; set; } = [];
}
