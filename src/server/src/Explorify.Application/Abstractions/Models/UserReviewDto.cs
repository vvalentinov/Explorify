namespace Explorify.Application.Abstractions.Models;

public class UserReviewDto
{
    public string UserName { get; set; } = default!;

    public string? ProfileImageUrl { get; set; }

    public bool HasLikedReview { get; set; }
}
