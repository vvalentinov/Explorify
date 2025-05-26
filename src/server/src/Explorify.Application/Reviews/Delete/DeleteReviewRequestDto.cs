namespace Explorify.Application.Reviews.Delete;

public class DeleteReviewRequestDto
{
    public Guid ReviewId { get; set; }

    public string? Reason { get; set; }
}
