using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Categories.GetSubcategories;

public class GetSubcategoriesQueryHandler
    : IQueryHandler<GetSubcategoriesQuery, SubcategoriesResponseModel>
{
    private readonly IRepository _repository;

    public GetSubcategoriesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<SubcategoriesResponseModel>> Handle(
        GetSubcategoriesQuery request,
        CancellationToken cancellationToken)
    {
        if (request.CategoryId <= 0)
        {
            var error = new Error(
                "Category id must be a positive integer!",
                ErrorType.Validation);

            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        var category = await _repository
            .AllAsNoTracking<Category>()
            .Select(x => new {x.Id, x.Name, x.Description })
            .FirstOrDefaultAsync(x => x.Id == request.CategoryId, cancellationToken);

        if (category == null)
        {
            var error = new Error(
                "No category with given id was found!",
                ErrorType.Validation);

            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        var responseModel = new SubcategoriesResponseModel
        {
            CategoryName = category.Name,
            CategoryDescription = category.Description ?? string.Empty,
        };

        var subcategories = await _repository
            .AllAsNoTracking<Category>()
            .Where(x => x.ParentId == request.CategoryId)
            .Select(x => new CategoryResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ImageUrl,
            }).ToListAsync(cancellationToken);

        responseModel.Subcategories = subcategories;

        return Result.Success(responseModel);
    }
}
