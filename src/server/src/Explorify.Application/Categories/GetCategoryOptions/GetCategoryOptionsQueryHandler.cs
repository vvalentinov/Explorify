using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Categories.GetCategoryOptions.DTOs;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Categories.GetCategoryOptions;

public class GetCategoryOptionsQueryHandler
    : IQueryHandler<GetCategoryOptionsQuery, IEnumerable<CategoryOptionDto>>
{
    private readonly IRepository _repository;

    public GetCategoryOptionsQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<CategoryOptionDto>>> Handle(
        GetCategoryOptionsQuery request,
        CancellationToken cancellationToken)
    {
        var result = (IEnumerable<CategoryOptionDto>)await _repository
            .AllAsNoTracking<Category>()
            .Where(c => c.ParentId == null)
            .Include(c => c.Children)
            .Select(c => new CategoryOptionDto
            {
                Id = c.Id,
                Name = c.Name,
                Subcategories = c.Children.Select(child => new SubcategoryOptionDto
                {
                    Id = child.Id,
                    Name = child.Name
                }).ToList()
            }).ToListAsync(cancellationToken);

        return Result.Success(result);
    }
}
