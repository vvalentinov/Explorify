using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetPlaces.GetApproved;

public record GetUserApprovedPlacesQuery(int Page, Guid CurrentUserId)
    : IQuery<PlacesListResponseModel>;
