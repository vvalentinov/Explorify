using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Categories.GetCategoryOptions.DTOs;

namespace Explorify.Application.Categories.GetCategoryOptions;

public record GetCategoryOptionsQuery
    : IQuery<IEnumerable<CategoryOptionDto>>;
