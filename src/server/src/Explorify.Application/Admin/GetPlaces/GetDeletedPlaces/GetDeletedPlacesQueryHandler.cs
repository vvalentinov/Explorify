using Explorify.Domain.Entities;
using Explorify.Application.Places;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetPlaces.GetDeletedPlaces;

public class GetDeletedPlacesQueryHandler
    : IQueryHandler<GetDeletedPlacesQuery, PlacesListResponseModel>
{
    private readonly IRepository _repository;

    public GetDeletedPlacesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetDeletedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        //var thresholdDate = DateTime.UtcNow.AddDays(-30);

        // in the last 5 minutes
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var query = _repository
            .AllAsNoTracking<Domain.Entities.Place>(ignoreQueryFilters: true)
            .Where(x => x.IsDeleted && x.DeletedOn >= cutoff && !x.IsCleaned)
            .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var deletedPlaces = await query
            .Skip((request.Page - 1) * PlacesPerPageCount)
            .Take(PlacesPerPageCount)
            .Select(x => new PlaceDisplayResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ThumbUrl,
                SlugifiedName = x.SlugifiedName,
                IsDeleted = x.IsDeleted
            }).ToListAsync(cancellationToken);

        var response = new PlacesListResponseModel
        {
            Places = deletedPlaces,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                RecordsCount = recordsCount,
                ItemsPerPage = PlacesPerPageCount,
            }
        };

        return Result.Success(response);
    }
}
