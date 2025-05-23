using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetReviews.GetUnapproved;

public record GetUnapprovedReviewsQuery(int Page)
    : IQuery<AdminReviewsListResponseModel>;
