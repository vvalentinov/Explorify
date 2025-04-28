using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.CategoryConstants;

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
        var category = await _repository
            .AllAsNoTracking<Category>()
            .Include(x => x.Children)
            .Select(x => new { x.Id, x.Name, x.Description, x.Children })
            .FirstOrDefaultAsync(x => x.Id == request.CategoryId, cancellationToken);

        if (category == null)
        {
            var error = new Error(NoCategoryWithIdError, ErrorType.Validation);
            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        var subcategoriesResponse = new SubcategoriesResponseModel
        {
            CategoryName = category.Name,
            CategoryDescription = category.Description ?? string.Empty,
            Subcategories = category
                .Children
                .Select(x => new CategoryResponseModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImageUrl = x.ImageUrl
                })
        };

        return Result.Success(subcategoriesResponse);
    }
}
