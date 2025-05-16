namespace Explorify.Application.Reviews;

public class ReviewsListResponseModel
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public IEnumerable<ReviewResponseModel> Reviews { get; set; } = [];
}
