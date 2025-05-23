using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetPlaces.GetDeleted;

public record GetUserDeletedPlacesQuery(Guid CurrentUserId, int Page)
    : IQuery<PlacesListResponseModel>;
