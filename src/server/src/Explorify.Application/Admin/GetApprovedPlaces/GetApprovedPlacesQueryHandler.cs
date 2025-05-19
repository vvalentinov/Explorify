using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetApprovedPlaces;

public class GetApprovedPlacesQueryHandler
    : IQueryHandler<GetApprovedPlacesQuery, PlacesListModel>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;

    public GetApprovedPlacesQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;

        _userService = userService;
    }

    public async Task<Result<PlacesListModel>> Handle(
        GetApprovedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Place>()
            .Where(x => x.IsApproved)
            .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var approvedPlaces = await query
            .Skip((request.Page - 1) * PlacesPerPageCount)
            .Take(PlacesPerPageCount)
            .Select(x => new PlaceResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                ThumbUrl = x.ThumbUrl,
                Description = x.Description,
                CountryName = x.Country.Name,
                CategoryName = x.Category.Name,
                UserId = x.UserId.ToString(),
                ReviewStars = x.Reviews.First().Rating,
                ReviewContent = x.Reviews.First().Content,
                ImagesUrls = x.Photos.Where(x => !x.IsDeleted).Select(p => p.Url).ToList(),
            }).ToListAsync(cancellationToken);

        var userIds = approvedPlaces
            .Select(p => p.UserId.ToUpperInvariant())
            .Distinct()
            .ToList();

        var usersDtos = await _userService.GetUserDtosByIdsAsync(userIds);

        foreach (var place in approvedPlaces)
        {
            var userDto = usersDtos
                .First(x => x.Id.ToString().Equals(
                    place.UserId,
                    StringComparison.InvariantCultureIgnoreCase));

            place.UserName = userDto.UserName;
            place.UserProfilePicUrl = userDto.ProfileImageUrl ?? string.Empty;
        }

        var response = new PlacesListModel
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
