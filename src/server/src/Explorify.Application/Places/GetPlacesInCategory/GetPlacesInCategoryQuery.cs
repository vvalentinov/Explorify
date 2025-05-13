using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetPlacesInCategory;

public record GetPlacesInCategoryQuery(int CategoryId, int Page)
    : IQuery<PlacesListResponseModel>;
