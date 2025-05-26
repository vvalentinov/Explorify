using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlaces.GetApproved;

public record GetApprovedPlacesQuery(
    int Page,
    bool IsForAdmin,
    Guid CurrentUserId) : IQuery<PlacesListResponseModel>;
