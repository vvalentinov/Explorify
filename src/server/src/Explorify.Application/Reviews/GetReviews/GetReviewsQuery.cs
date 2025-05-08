using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews;

public record GetReviewsQuery(Guid PlaceId)
    : IQuery<List<ReviewResponseModel>>;
