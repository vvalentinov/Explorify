using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetPlacesInSubcategory;

public record GetPlacesInSubcategoryQuery(int SubcategoryId, int Page)
    : IQuery<PlacesListResponseModel>;
