using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Categories.GetCategories;

public record GetCategoriesQuery
    : IQuery<IEnumerable<CategoryResponseModel>>;
