using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetPlacesInCategory;

public class GetPlacesInCategoryQueryHandler
    : IQueryHandler<GetPlacesInCategoryQuery,
        IEnumerable<PlaceDisplayResponseModel>>
{
    private readonly IRepository _repository;

    public GetPlacesInCategoryQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<PlaceDisplayResponseModel>>> Handle(
        GetPlacesInCategoryQuery request,
        CancellationToken cancellationToken)
    {
        var places = (IEnumerable<PlaceDisplayResponseModel>)await _repository
            .AllAsNoTracking<Place>()
            .Include(x => x.Category)
            .Include(x => x.Photos)
            .Where(x => x.Category.ParentId == request.CategoryId)
            .Select(x => new PlaceDisplayResponseModel
            {
                Name = x.Name,
                ImageUrl = x.Photos
                    .OrderBy(x => x.CreatedOn)
                    .Select(photo => photo.Url)
                    .First(),
            }).ToListAsync(cancellationToken);

        return Result.Success(places);
    }
}
