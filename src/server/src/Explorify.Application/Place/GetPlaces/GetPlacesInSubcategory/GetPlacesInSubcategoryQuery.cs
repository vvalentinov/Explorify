using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlaces.GetPlacesInSubcategory;

public record GetPlacesInSubcategoryQuery(
    int SubcategoryId,
    int Page,
    Guid CurrentUserId) : IQuery<PlacesListResponseModel>;
