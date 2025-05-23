using Explorify.Domain.Entities;
using Explorify.Application.Places;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.User.GetPlaces.GetUnapproved;

public class GetUserUnapprovedPlacesQueryHandler
    : IQueryHandler<GetUserUnapprovedPlacesQuery, PlacesListResponseModel>
{
    private readonly IRepository _repository;

    public GetUserUnapprovedPlacesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetUserUnapprovedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var currPage = request.Page;
        var currUserId = request.CurrentUserId;

        var query = _repository
            .AllAsNoTracking<Place>()
            .Where(x => !x.IsApproved && x.UserId == currUserId);

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
