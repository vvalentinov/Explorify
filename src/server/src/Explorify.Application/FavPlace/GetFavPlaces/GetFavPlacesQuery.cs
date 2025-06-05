using Explorify.Application.Place;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.FavPlace.GetFavPlaces;

public record GetFavPlacesQuery(
    Guid CurrentUserId,
    int Page) : IQuery<PlacesListResponseModel>;
