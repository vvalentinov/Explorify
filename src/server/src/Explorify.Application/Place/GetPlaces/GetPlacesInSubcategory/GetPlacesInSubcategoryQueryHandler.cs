using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Place.GetPlaces.GetPlacesInSubcategory;

public class GetPlacesInSubcategoryQueryHandler
    : IQueryHandler<GetPlacesInSubcategoryQuery, PlacesListResponseModel>
{
    private readonly IRepository _repository;

    public GetPlacesInSubcategoryQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetPlacesInSubcategoryQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Domain.Entities.Place>()
            .Where(x => x.IsApproved &&  x.CategoryId == request.SubcategoryId)
            .Select(x => new PlaceDisplayResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ThumbUrl,
                SlugifiedName = x.SlugifiedName,
            });

        var recordsCount = await query.CountAsync(cancellationToken);

        var places = await query
            .Skip(request.Page * PlacesPerPageCount - PlacesPerPageCount)
            .Take(PlacesPerPageCount)
            .ToListAsync(cancellationToken);

        var responseModel = new PlacesListResponseModel
        {
            Places = places,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                RecordsCount = recordsCount,
                ItemsPerPage = PlacesPerPageCount,
            },
        };

        return Result.Success(responseModel);
    }
}
