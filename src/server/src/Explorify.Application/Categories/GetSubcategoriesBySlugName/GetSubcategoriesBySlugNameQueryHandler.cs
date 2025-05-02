using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.CategoryConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;
using Explorify.Application.Categories.GetSubcategoriesByName;

namespace Explorify.Application.Categories.GetSubcategoriesBySlugName;

public class GetSubcategoriesBySlugNameQueryHandler
    : IQueryHandler<
        GetSubcategoriesBySlugNameQuery,
        SubcategoriesResponseModel>
{
    private readonly IRepository _repository;

    public GetSubcategoriesBySlugNameQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<SubcategoriesResponseModel>> Handle(
        GetSubcategoriesBySlugNameQuery request,
        CancellationToken cancellationToken)
    {
        var responseModel = await _repository
            .AllAsNoTracking<Category>()
            .Include(x => x.Children)
            .Select(x => new SubcategoriesResponseModel
            {
                CategoryName = x.Name,
                SlugifiedCategoryName = x.SlugifiedName,
                CategoryDescription = x.Description ?? string.Empty,
                Subcategories = x.Children.Select(y => new CategoryResponseModel
                {
                    Id = y.Id,
                    Name = y.Name,
                    ImageUrl = y.ImageUrl,
                    SlugifiedName = y.SlugifiedName,
                }),
            }).FirstOrDefaultAsync(x =>
                x.SlugifiedCategoryName == request.CategoryName,
                cancellationToken);

        if (responseModel == null)
        {
            var error = new Error(NoCategoryWithNameError, ErrorType.Validation);
            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        return Result.Success(responseModel);
    }
}
