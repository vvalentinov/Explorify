using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetPlaces.GetUnapproved;

public record GetUserUnapprovedPlacesQuery(Guid CurrentUserId, int Page)
    : IQuery<PlacesListResponseModel>;
