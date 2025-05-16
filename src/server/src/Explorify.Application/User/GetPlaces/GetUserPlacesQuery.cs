using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetPlaces;

public record GetUserPlacesQuery(Guid UserId, int Page)
    : IQuery<PlacesListResponseModel>;
