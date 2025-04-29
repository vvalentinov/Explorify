using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.GetPlacesInCategory;

public record GetPlacesInCategoryQuery(int CategoryId)
    : IQuery<IEnumerable<PlaceDisplayResponseModel>>;
