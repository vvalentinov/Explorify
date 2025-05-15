using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetUnapprovedReviews;

public class GetUnapprovedReviewsQueryHandler :
    IQueryHandler<GetUnapprovedReviewsQuery, UnapprovedReviewsListModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetUnapprovedReviewsQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<UnapprovedReviewsListModel>> Handle(
        GetUnapprovedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
             .AllAsNoTracking<Review>()
             .Where(x => x.IsApproved == false && x.UserId != x.Place.UserId)
             .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var unapprovedReviews = await query
            .Skip((request.Page - 1) * 6)
            .Take(6)
            .Select(x => new UnapprovedReviewResponseModel
            {
                Id = x.Id,
                Content = x.Content,
                ImagesUrls = x.Photos.Select(p => p.Url).ToList(),
                PlaceName = x.Place.Name,
                Rating = x.Rating,
                UserId = x.UserId.ToString(),
            }).ToListAsync(cancellationToken);

        var userIds = unapprovedReviews
            .Select(p => p.UserId.ToUpperInvariant())
            .ToList();

        var usersDtos = await _userService.GetUserDtosByIdsAsync(userIds);

        foreach (var review in unapprovedReviews)
        {
            var userDto = usersDtos.FirstOrDefault(x => x.Id.ToString().ToUpper() == review.UserId);

            if (userDto != null)
            {
                review.UserName = userDto.UserName;
                review.UserProfilePicUrl = userDto.ProfileImageUrl ?? string.Empty;
            }
        }

        var response = new UnapprovedReviewsListModel
        {
            Reviews = unapprovedReviews,
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = 6,
                RecordsCount = recordsCount,
                PageNumber = request.Page,
            }
        };

        return Result.Success(response);
    }
}
