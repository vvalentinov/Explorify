using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews;

public record GetReviewsQuery(GetReviewsRequestModel Model, Guid UserId)
    : IQuery<ReviewsListResponseModel>;
