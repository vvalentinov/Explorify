using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlace.GetPlaceBySlugifiedName;

public record GetPlaceBySlugifiedNameQuery(
    string SlugifiedName,
    Guid CurrentUserId) : IQuery<PlaceDetailsResponseModel>;
