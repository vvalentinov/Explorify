using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.ForPlace;

public record GetReviewsForPlaceQuery(
    Guid PlaceId,
    int Page,
    ReviewsOrderEnum Order,
    Guid CurrentUserId) : IQuery<ReviewsListResponseModel>;
