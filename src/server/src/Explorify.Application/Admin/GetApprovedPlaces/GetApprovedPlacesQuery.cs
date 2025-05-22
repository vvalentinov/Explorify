using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetApprovedPlaces;

public record GetApprovedPlacesQuery(int Page)
    : IQuery<PlacesListResponseModel>;
