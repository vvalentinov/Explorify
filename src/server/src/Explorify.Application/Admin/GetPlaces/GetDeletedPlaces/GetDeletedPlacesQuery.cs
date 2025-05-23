using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetPlaces.GetDeletedPlaces;

public record GetDeletedPlacesQuery(int Page)
    : IQuery<PlacesListResponseModel>;