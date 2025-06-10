using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.ForPlace;

public record GetReviewsForPlaceQuery(
    Guid PlaceId,
    int Page,
    OrderEnum Order,
    IEnumerable<int> starsFilter,
    Guid CurrentUserId) : IQuery<ReviewsListResponseModel>;
