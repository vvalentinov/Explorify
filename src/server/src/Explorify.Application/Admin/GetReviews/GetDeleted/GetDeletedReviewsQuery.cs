using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetReviews.GetDeleted;

public record GetDeletedReviewsQuery(int Page)
    : IQuery<AdminReviewsListResponseModel>;
