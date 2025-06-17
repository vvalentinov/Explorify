namespace Explorify.Application.Reviews.GetReviews.ForFollowedUser;

public class GetReviewsForFollowedUserQueryDto
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public IEnumerable<FollowedUserReviewDto> Reviews { get; set; } = [];
}
