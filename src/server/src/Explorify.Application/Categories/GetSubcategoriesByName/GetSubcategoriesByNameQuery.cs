using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Categories.GetSubcategoriesByName;

public record GetSubcategoriesByNameQuery(string CategoryName)
    : IQuery<IEnumerable<CategoryResponseModel>>;
