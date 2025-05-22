using Explorify.Application.Places;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetUnapprovedPlaces;

public record GetUnapprovedPlacesQuery(int Page)
    : IQuery<PlacesListResponseModel>;
