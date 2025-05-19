using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetDeletedPlaces;

public record GetDeletedPlacesQuery(int Page)
    : IQuery<PlacesListModel>;