using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlaces.GetPlacesInCategory;

public record GetPlacesInCategoryQuery(
    int CategoryId,
    int Page) : IQuery<PlacesListResponseModel>;
