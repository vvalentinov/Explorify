using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Categories.GetSubcategories;

public record GetSubcategoriesQuery(int CategoryId)
    : IQuery<IEnumerable<string>>;
