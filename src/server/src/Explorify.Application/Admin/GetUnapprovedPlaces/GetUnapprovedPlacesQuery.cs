using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetUnapprovedPlaces;

public record GetUnapprovedPlacesQuery()
    : IQuery<UnapprovedPlacesListModel>;
