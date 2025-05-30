namespace Explorify.Application.Reviews;

public class ReviewResponseModel
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public int Likes { get; set; }

    public string PlaceName { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public string UserName { get; set; } = default!;

    public string? ProfileImageUrl { get; set; }

    public bool HasLikedReview { get; set; }

    public IEnumerable<string> ImagesUrls { get; set; } = [];

    public DateTime CreatedOn { get; set; }

    public bool IsApproved { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsDeletedByAdmin { get; set; }
}
