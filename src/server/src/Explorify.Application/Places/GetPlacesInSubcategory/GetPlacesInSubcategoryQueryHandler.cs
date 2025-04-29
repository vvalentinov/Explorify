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
        var places = (IEnumerable<PlaceDisplayResponseModel>)await _repository
            .AllAsNoTracking<Place>()
            .Include(x => x.Photos)
            .Where(x => x.CategoryId == request.SubcategoryId)
            .Select(x => new PlaceDisplayResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.Photos
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(photo => photo.Url)
                    .First(),
            }).ToListAsync(cancellationToken);

        return Result.Success(places);
    }
}
