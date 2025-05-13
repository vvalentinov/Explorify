using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetPlaces.GetAllUserPlaces;

public record GetAllUserPlacesQuery(Guid UserId, int Page)
    : IQuery<PlacesListResponseModel>;
