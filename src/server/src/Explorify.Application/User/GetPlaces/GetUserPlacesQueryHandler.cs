using Explorify.Domain.Entities;
using Explorify.Application.Places;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.User.GetPlaces;

public class GetUserPlacesQueryHandler :
    IQueryHandler<GetUserPlacesQuery, PlacesListResponseModel>
{
    private readonly IRepository _repository;

    public GetUserPlacesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetUserPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Place>()
            .Where(x => x.UserId == request.UserId);

        var recordsCount = await query.CountAsync(cancellationToken);

        var places = await query
            .Skip(request.Page * 6 - 6)
            .Take(6)
            .Select(x => new PlaceDisplayResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ThumbUrl,
                SlugifiedName = x.SlugifiedName,
            }).ToListAsync(cancellationToken);

        var responseModel = new PlacesListResponseModel
        {
            Places = places,
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = 6,
                PageNumber = request.Page,
                RecordsCount = recordsCount,
            },
        };

        return Result.Success(responseModel);
    }
}
