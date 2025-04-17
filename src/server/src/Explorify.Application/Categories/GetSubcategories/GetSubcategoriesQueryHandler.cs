using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Categories.GetSubcategories;

public class GetSubcategoriesQueryHandler
    : IQueryHandler<GetSubcategoriesQuery, IEnumerable<string>>
{
    private readonly IRepository _repository;

    public GetSubcategoriesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<string>>> Handle(
        GetSubcategoriesQuery request,
        CancellationToken cancellationToken)
    {
        if (request.CategoryId <= 0)
        {
            var error = new Error(
                "Category id must be a positive integer!",
                ErrorType.Validation);

            return Result.Failure<IEnumerable<string>>(error);
        }

        var subcategories = (IEnumerable<string>)await _repository
            .AllAsNoTracking<Category>()
            .Where(x => x.ParentId == request.CategoryId)
            .Select(x => x.Name)
            .ToListAsync(cancellationToken);

        return Result.Success(subcategories);
    }
}
