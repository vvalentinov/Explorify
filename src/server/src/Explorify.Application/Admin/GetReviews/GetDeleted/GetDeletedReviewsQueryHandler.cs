using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.GetReviews.GetDeleted;

public class GetDeletedReviewsQueryHandler
    : IQueryHandler<GetDeletedReviewsQuery, AdminReviewsListResponseModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetDeletedReviewsQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<AdminReviewsListResponseModel>> Handle(
        GetDeletedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var query = _repository
             .AllAsNoTracking<Review>(withDeleted: true)
             .Where(x =>
                x.IsDeleted &&
                x.UserId != x.Place.UserId &&
                x.DeletedOn >= cutoff)
             .OrderByDescending(x => x.CreatedOn);

        var recordsCount = await query.CountAsync(cancellationToken);

        var unapprovedReviews = await query
            .Skip((request.Page - 1) * ReviewsPerPageCount)
            .Take(ReviewsPerPageCount)
            .Select(x => new AdminReviewResponseModel
            {
                Id = x.Id,
                Content = x.Content,
                ImagesUrls = x.Photos.Select(p => p.Url).ToList(),
                PlaceName = x.Place.Name,
                Rating = x.Rating,
                UserId = x.UserId,
                Likes = x.Likes,
            }).ToListAsync(cancellationToken);

        var userIds = unapprovedReviews
            .Select(p => p.UserId.ToString().ToUpperInvariant())
            .ToList();

        var usersDtos = await _userService.GetUserDtosByIdsAsync(userIds);

        foreach (var review in unapprovedReviews)
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
            Reviews = unapprovedReviews,
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = ReviewsPerPageCount,
                RecordsCount = recordsCount,
                PageNumber = request.Page,
            }
        };

        return Result.Success(response);
    }
}
