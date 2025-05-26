using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlace.GetPlaceById;

public record GetPlaceByIdQuery(
    Guid PlaceId,
    bool IsForAdmin,
    Guid CurrentUserId,
    bool IsCurrentUserAdmin) : IQuery<PlaceDetailsResponseModel>;
