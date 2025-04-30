using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Categories.GetSubcategoriesByName;

public record GetSubcategoriesBySlugNameQuery(string CategoryName)
    : IQuery<SubcategoriesResponseModel>;
