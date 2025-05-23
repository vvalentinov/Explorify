namespace Explorify.Application.User.GetReviews;

public class UserReviewsListResponseModel
{
    public PaginationResponseModel Pagination { get; set; } = new();

    public List<UserReviewResponseModel> Reviews { get; set; } = new();
}
