using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Categories.GetSubcategoriesByName;

public class GetSubcategoriesByNameQueryHandler
    : IQueryHandler<
        GetSubcategoriesByNameQuery,
        SubcategoriesResponseModel>
{
    private readonly IRepository _repository;

    public GetSubcategoriesByNameQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<SubcategoriesResponseModel>> Handle(
        GetSubcategoriesByNameQuery request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.CategoryName))
        {
            var error = new Error(
                "Category name cannot be null or whitespace!",
                ErrorType.Validation);

            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        var category = await _repository
          .AllAsNoTracking<Category>()
          .Select(x => new { x.Id, x.Name, x.Description })
          .FirstOrDefaultAsync(x => x.Name == request.CategoryName, cancellationToken);

        if (category == null)
        {
            var error = new Error(
                "No category with given name was found!",
                ErrorType.Validation);

            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        var subcategories = (IEnumerable<CategoryResponseModel>)await _repository
            .AllAsNoTracking<Category>()
            .Where(x => x.ParentId == category.Id)
            .Select(x => new CategoryResponseModel
            {
                Name = x.Name,
                ImageUrl = x.ImageUrl,
                Id = x.Id,
            }).ToListAsync(cancellationToken);

        var responseModel = new SubcategoriesResponseModel
        {
            CategoryName = category.Name,
            CategoryDescription = category.Description ?? string.Empty,
            Subcategories = subcategories,
        };

        return Result.Success(responseModel);
    }
}
