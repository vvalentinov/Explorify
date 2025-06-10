namespace Explorify.Application.Reviews.GetReviews;

public class GetReviewsRequestModel
{
    public Guid PlaceId { get; set; }

    public int Page { get; set; }

    public OrderEnum Order { get; set; }
}
