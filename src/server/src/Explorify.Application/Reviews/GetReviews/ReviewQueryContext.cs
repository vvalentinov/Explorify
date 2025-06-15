namespace Explorify.Application.Reviews.GetReviews;

public class ReviewQueryContext
{
    public Guid CurrentUserId { get; init; }

    public bool IsAdmin { get; init; }

    public int Page { get; init; }

    public IEnumerable<int> StarsFilter { get; init; } = [];

    public OrderEnum Order { get; init; }

    public int ItemsPerPage { get; init; } = Domain.Constants.ReviewConstants.ReviewsPerPageCount;

    // This is only needed for place-specific queries
    public Guid? PlaceId { get; init; }

    public DateTime? DeletedCutoff { get; init; }
}
