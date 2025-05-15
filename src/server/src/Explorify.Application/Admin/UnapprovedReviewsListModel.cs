namespace Explorify.Application.Admin;

public class UnapprovedReviewsListModel
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public List<UnapprovedReviewResponseModel> Reviews { get; set; } = [];
}
