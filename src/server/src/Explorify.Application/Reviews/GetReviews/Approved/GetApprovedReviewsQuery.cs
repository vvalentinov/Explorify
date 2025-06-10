using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.Approved;

public record GetApprovedReviewsQuery(
    Guid CurrentUserId,
    bool IsCurrUserAdmin,
    int Page,
    bool IsForAdmin,
    OrderEnum Order,
    IEnumerable<int> StarFilters) : IQuery<ReviewsListResponseModel>;
