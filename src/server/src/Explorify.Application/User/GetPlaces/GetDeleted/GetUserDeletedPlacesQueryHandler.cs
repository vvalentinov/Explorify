using Explorify.Domain.Entities;
using Explorify.Application.Places;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.User.GetPlaces.GetDeleted;

public class GetUserDeletedPlacesQueryHandler
    : IQueryHandler<GetUserDeletedPlacesQuery, PlacesListResponseModel>
{
    private readonly IRepository _repository;

    public GetUserDeletedPlacesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetUserDeletedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var currPage = request.Page;
        var currUserId = request.CurrentUserId;

        // in the last 5 minutes
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var query = _repository
            .AllAsNoTracking<Place>(withDeleted: true)
            .Where(x =>
                x.IsDeleted &&
                x.DeletedOn >= cutoff &&
                x.UserId == currUserId);

        var recordsCount = await query.CountAsync(cancellationToken);

        var places = await query
            .Skip((request.Page - 1) * PlacesPerPageCount)
            .Take(PlacesPerPageCount)
            .Select(x => new PlaceDisplayResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ThumbUrl,
                SlugifiedName = x.SlugifiedName,
                IsDeleted = x.IsDeleted,
            }).ToListAsync(cancellationToken);

        var responseModel = new PlacesListResponseModel
        {
            Places = places,
            Pagination = new PaginationResponseModel
            {
                PageNumber = currPage,
                RecordsCount = recordsCount,
                ItemsPerPage = PlacesPerPageCount,
            },
        };

        return Result.Success(responseModel);
    }
}
