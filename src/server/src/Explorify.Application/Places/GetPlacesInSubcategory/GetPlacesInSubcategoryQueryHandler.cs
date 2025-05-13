using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetPlacesInSubcategory;

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
            .AllAsNoTracking<Place>()
            .Where(x => x.CategoryId == request.SubcategoryId && x.IsApproved);

        var recordsCount = await query.CountAsync(cancellationToken);

        var places = await query
            .Skip((request.Page * 6) - 6)
            .Take(6)
            .Include(x => x.Photos)
            .Select(x => new
            {
                x.Id,
                x.Name,
                Photos = x.Photos.Select(p => p.Url).ToList()
            }).ToListAsync(cancellationToken);

        var resultPlaces = places.Select(x => new PlaceDisplayResponseModel
        {
            Id = x.Id,
            Name = x.Name,
            ImageUrl = x.Photos
                .FirstOrDefault(url => Path.GetFileName(url).StartsWith("thumb_")) ??
                x.Photos.First(),
        });

        var responseModel = new PlacesListResponseModel
        {
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = 6,
                PageNumber = request.Page,
                RecordsCount = recordsCount
            },
            Places = resultPlaces
        };

        return Result.Success(responseModel);
    }
}
