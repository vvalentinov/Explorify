namespace Explorify.Application.Admin.Review.UnapproveReview;

public class UnapproveReviewDto
{
    public Guid ReviewId { get; set; }

    public string Reason { get; set; } = string.Empty;
}
