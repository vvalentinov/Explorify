using Explorify.Domain.Entities;
using Explorify.Application.Places;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetPlaces.GetApprovedPlaces;

public class GetApprovedPlacesQueryHandler
    : IQueryHandler<GetApprovedPlacesQuery, PlacesListResponseModel>
{
    private readonly IRepository _repository;

    public GetApprovedPlacesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetApprovedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Domain.Entities.Place>()
            .Where(x => x.IsApproved)
            .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var approvedPlaces = await query
            .Skip((request.Page - 1) * PlacesPerPageCount)
            .Take(PlacesPerPageCount)
            .Select(x => new PlaceDisplayResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ThumbUrl,
                SlugifiedName = x.SlugifiedName,
            }).ToListAsync(cancellationToken);

        var response = new PlacesListResponseModel
        {
            Places = approvedPlaces,
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
