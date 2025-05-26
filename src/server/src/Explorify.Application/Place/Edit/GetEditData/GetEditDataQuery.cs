using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.Edit.GetEditData;

public record GetEditDataQuery(
    Guid PlaceId,
    Guid CurrentUserId) : IQuery<GetEditDataResponseModel>;
