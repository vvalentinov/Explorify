namespace Explorify.Application.Reviews.GetReviews.ForFollowedUser;

public class FollowedUserReviewDto
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public int Likes { get; set; }

    public Guid PlaceId { get; set; }

    public string PlaceName { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public string UserName { get; set; } = default!;

    public string? ProfileImageUrl { get; set; }

    public IEnumerable<string> ImagesUrls { get; set; } = [];

    public DateTime CreatedOn { get; set; }
}
