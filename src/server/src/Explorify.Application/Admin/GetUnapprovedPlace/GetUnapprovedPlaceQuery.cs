using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetUnapprovedPlace;

public record GetUnapprovedPlaceQuery(Guid PlaceId)
    : IQuery<UnapprovedPlaceResponseModel>;
