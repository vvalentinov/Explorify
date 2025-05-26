using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlaces.GetDeleted;

public record GetDeletedPlacesQuery(
    int Page,
    bool IsForAdmin,
    Guid CurrentUserId) : IQuery<PlacesListResponseModel>;