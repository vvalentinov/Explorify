using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetPlace;

public record GetPlaceByIdQuery(
    Guid PlaceId,
    Guid? CurrentUserId = null,
    bool IsCurrentUserAdmin = false)
    : IQuery<PlaceDetailsResponseModel>;
