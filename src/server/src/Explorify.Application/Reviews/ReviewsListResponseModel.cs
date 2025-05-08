namespace Explorify.Application.Reviews;

public class ReviewsListResponseModel
{
    public int RecordsCount { get; set; }

    public int ItemsPerPage { get; set; }

    public int PageNumber { get; set; }

    public int PagesCount => (int)Math.Ceiling((double)RecordsCount / ItemsPerPage);

    public IEnumerable<ReviewResponseModel> Reviews { get; set; } = [];
}
