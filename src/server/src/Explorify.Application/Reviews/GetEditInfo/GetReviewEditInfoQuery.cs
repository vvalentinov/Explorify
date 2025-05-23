using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetEditInfo;

public record GetReviewEditInfoQuery(
    Guid ReviewId,
    Guid CurrentUserId) : IQuery<GetReviewEditInfoResponseModel>;
