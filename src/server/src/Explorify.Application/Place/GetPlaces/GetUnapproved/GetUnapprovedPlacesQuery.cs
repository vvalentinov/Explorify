using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlaces.GetUnapproved;

public record GetUnapprovedPlacesQuery(
    int Page,
    bool IsForAdmin,
    Guid CurrentUserId) : IQuery<PlacesListResponseModel>;
