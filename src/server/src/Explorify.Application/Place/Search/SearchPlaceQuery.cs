using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.Search;

public record SearchPlaceQuery(
    SearchPlaceRequestDto Model,
    int Page,
    Guid CurrentUserId,
    bool IsCurrentUserAdmin,
    bool IsUserAuthenticated) : IQuery<PlacesListResponseModel>;
