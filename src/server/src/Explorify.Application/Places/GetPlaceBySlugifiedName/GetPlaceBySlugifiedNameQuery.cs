using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetPlaceBySlugifiedName;

public record GetPlaceBySlugifiedNameQuery(string SlugifiedName)
    : IQuery<PlaceDetailsResponseModel>;
