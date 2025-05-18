using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetEditData;

public record GetEditDataQuery(Guid PlaceId, Guid CurrentUserId)
    : IQuery<GetEditDataResponseModel>;
