using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Categories.GetSubcategoriesByName;

public class GetSubcategoriesByNameQueryHandler
    : IQueryHandler<
        GetSubcategoriesByNameQuery,
        IEnumerable<CategoryResponseModel>>
{
    private readonly IRepository _repository;

    public GetSubcategoriesByNameQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<CategoryResponseModel>>> Handle(
        GetSubcategoriesByNameQuery request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.CategoryName))
        {
            var error = new Error(
                "Category name cannot be null or whitespace!",
                ErrorType.Validation);

            return Result.Failure<IEnumerable<CategoryResponseModel>>(error);
        }

        var categoryId = await _repository
            .AllAsNoTracking<Category>()
            .Where(x => x.Name.ToLower() == request.CategoryName.ToLower())
            .Select(x => x.Id)
            .FirstOrDefaultAsync(cancellationToken);

        var subcategories = (IEnumerable<CategoryResponseModel>)await _repository
            .AllAsNoTracking<Category>()
            .Where(x => x.ParentId == categoryId)
            .Select(x => new CategoryResponseModel
            {
                Name = x.Name,
                ImageUrl = x.ImageUrl,
                Id = x.Id,
            }).ToListAsync(cancellationToken);

        return Result.Success(subcategories);
    }
}
