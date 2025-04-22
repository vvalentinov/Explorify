using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Categories.GetCategories;

public class GetCategoriesQueryHandler
    : IQueryHandler<GetCategoriesQuery, IEnumerable<CategoryResponseModel>>
{
    private readonly IRepository _repository;

    public GetCategoriesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<CategoryResponseModel>>> Handle(
        GetCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        var categories = (IEnumerable<CategoryResponseModel>)await _repository
            .AllAsNoTracking<Category>()
            .Where(x => x.ParentId == null)
            .Select(x => new CategoryResponseModel
            {
                Name = x.Name,
                Description = x.Description ?? string.Empty,
                ImageUrl = x.ImageUrl,
            }).ToListAsync(cancellationToken);

        return Result.Success(categories);
    }
}
