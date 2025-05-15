using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetUnapprovedReviews;

public record GetUnapprovedReviewsQuery(int Page)
    : IQuery<UnapprovedReviewsListModel>;
