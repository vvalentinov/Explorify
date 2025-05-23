namespace Explorify.Application.Admin.GetReviews;

public class AdminReviewsListResponseModel
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public IEnumerable<AdminReviewResponseModel> Reviews { get; set; } = [];
}
