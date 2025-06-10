namespace Explorify.Application.Reviews.GetReviews;

public class PlaceReviewsRequestDto
{
    public Guid PlaceId { get; set; }

    public OrderEnum Order { get; set; }

    public IEnumerable<int> StarsFilter { get; set; } = [];

    public int Page { get; set; } = 1;
}
