using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetPlace;

public record GetPlaceQuery(Guid PlaceId)
    : IQuery<PlaceDetailsResponseModel>;
