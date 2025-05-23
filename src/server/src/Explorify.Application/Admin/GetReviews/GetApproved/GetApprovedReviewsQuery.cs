using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetReviews.GetApproved;

public record GetApprovedReviewsQuery(int Page)
    : IQuery<AdminReviewsListResponseModel>;
