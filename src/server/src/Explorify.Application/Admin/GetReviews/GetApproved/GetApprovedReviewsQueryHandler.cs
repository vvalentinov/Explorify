using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetReviews.GetApproved;

public class GetApprovedReviewsQueryHandler
    : IQueryHandler<GetApprovedReviewsQuery, AdminReviewsListResponseModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetApprovedReviewsQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<AdminReviewsListResponseModel>> Handle(
        GetApprovedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
             .AllAsNoTracking<Review>()
             .Where(x =>
                x.IsApproved &&
                x.UserId != x.Place.UserId)
             .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var approvedReviews = await query
            .Skip((request.Page - 1) * UserReviewUploadPoints)
            .Take(UserReviewUploadPoints)
            .Select(x => new AdminReviewResponseModel
            {
                Id = x.Id,
                Rating = x.Rating,
                Content = x.Content,
                PlaceName = x.Place.Name,
                UserId = x.UserId,
                Likes = x.Likes,                
                ImagesUrls = x.Photos.Select(p => p.Url).ToList(),
            }).ToListAsync(cancellationToken);

        var userIds = approvedReviews
            .Select(p => p.UserId.ToString().ToUpperInvariant())
            .ToList();

        var usersDtos = await _userService.GetUserDtosByIdsAsync(userIds);

        foreach (var review in approvedReviews)
        {
            var userDto = usersDtos.FirstOrDefault(x =>
                x.Id.ToString().ToUpper() == review.UserId.ToString());

            if (userDto != null)
            {
                review.UserName = userDto.UserName;
                review.ProfileImageUrl = userDto.ProfileImageUrl ?? string.Empty;
            }
        }

        var response = new AdminReviewsListResponseModel
        {
            Reviews = approvedReviews,
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
