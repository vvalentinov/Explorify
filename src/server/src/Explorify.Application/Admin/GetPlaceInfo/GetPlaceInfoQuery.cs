using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetPlaceInfo;

public record GetPlaceInfoQuery(Guid PlaceId)
    : IQuery<AdminPlaceInfoResponseModel>;
