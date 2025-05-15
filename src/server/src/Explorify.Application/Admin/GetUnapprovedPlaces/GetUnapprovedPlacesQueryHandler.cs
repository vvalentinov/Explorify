using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetUnapprovedPlaces;

public class GetUnapprovedPlacesQueryHandler
    : IQueryHandler<GetUnapprovedPlacesQuery, UnapprovedPlacesListModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetUnapprovedPlacesQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<UnapprovedPlacesListModel>> Handle(
        GetUnapprovedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Place>()
            .Where(x => x.IsApproved == false)
            .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var unapprovedPlaces = await query
            .Skip((request.Page - 1) * 6)
            .Take(6)
            .Select(x => new UnapprovedPlaceResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                CategoryName = x.Category.Name,
                CountryName = x.Country.Name,
                Description = x.Description,
                ImagesUrls = x.Photos.Select(p => p.Url).ToList(),
                ReviewContent = x.Reviews.First().Content,
                ReviewStars = x.Reviews.First().Rating,
                UserId = x.UserId.ToString(),
            }).ToListAsync(cancellationToken);

        var userIds = unapprovedPlaces
            .Select(p => p.UserId.ToUpperInvariant())
            .Distinct()
            .ToList();

        var usersDtos = await _userService.GetUserDtosByIdsAsync(userIds);

        foreach (var place in unapprovedPlaces)
        {
            var userDto = usersDtos
                .First(x => x.Id.ToString().Equals(
                    place.UserId,
                    StringComparison.InvariantCultureIgnoreCase));

            place.UserName = userDto.UserName;
        }

        var response = new UnapprovedPlacesListModel
        {
            Places = unapprovedPlaces,
            RecordsCount = recordsCount,
            ItemsPerPage = 6,
            PageNumber = request.Page,
        };

        return Result.Success(response);
    }
}
