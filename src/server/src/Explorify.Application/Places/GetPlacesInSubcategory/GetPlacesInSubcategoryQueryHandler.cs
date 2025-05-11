using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetPlacesInSubcategory;

public class GetPlacesInSubcategoryQueryHandler
    : IQueryHandler<GetPlacesInSubcategoryQuery,
        IEnumerable<PlaceDisplayResponseModel>>
{
    private readonly IRepository _repository;

    public GetPlacesInSubcategoryQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<PlaceDisplayResponseModel>>> Handle(
        GetPlacesInSubcategoryQuery request,
        CancellationToken cancellationToken)
    {
        var places = await _repository
            .AllAsNoTracking<Place>()
            .Where(x => x.CategoryId == request.SubcategoryId && x.IsApproved)
            .Include(x => x.Photos)
            .Select(x => new
            {
                x.Id,
                x.Name,
                Photos = x.Photos.Select(p => p.Url).ToList()
            })
            .ToListAsync(cancellationToken);

        var result = places.Select(x => new PlaceDisplayResponseModel
        {
            Id = x.Id,
            Name = x.Name,
            ImageUrl = x.Photos.FirstOrDefault(url => Path.GetFileName(url).StartsWith("thumb_")) ?? x.Photos.First(),
        });

        return Result.Success(result);
    }
}
