namespace Explorify.Application.Admin.Review.DeleteReview;

public class AdminDeleteReviewRequestDto
{
    public Guid ReviewId { get; set; }

    public string Reason { get; set; } = string.Empty;
}
