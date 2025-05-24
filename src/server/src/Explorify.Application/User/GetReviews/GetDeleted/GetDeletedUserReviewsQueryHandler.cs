using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.User.GetReviews.GetDeleted;

public class GetDeletedUserReviewsQueryHandler :
    IQueryHandler<GetDeletedUserReviewsQuery, UserReviewsListResponseModel>
{
    private readonly IRepository _repository;

    public GetDeletedUserReviewsQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<UserReviewsListResponseModel>> Handle(
        GetDeletedUserReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var query = _repository
            .AllAsNoTracking<Review>(ignoreQueryFilters: true)
            .Where(x =>
                x.IsDeleted &&
                x.DeletedOn >= cutoff &&
                x.UserId == request.CurrentUserId &&
                !x.Place.IsDeleted &&
                !x.IsDeletedByAdmin);

        var recordsCount = await query.CountAsync(cancellationToken);

        var reviews = await query
            .OrderByDescending(x => x.DeletedOn)
            .Skip((request.Page - 1) * ReviewsPerPageCount)
            .Take(ReviewsPerPageCount)
            .Select(x => new UserReviewResponseModel
            {
                Id = x.Id,
                Content = x.Content,
                Likes = x.Likes,
                Rating = x.Rating,
                PlaceName = x.Place.Name,
                ImagesUrls = x.Photos.Select(p => p.Url),
            }).ToListAsync(cancellationToken);

        var model = new UserReviewsListResponseModel
        {
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                RecordsCount = recordsCount,
                ItemsPerPage = ReviewsPerPageCount,
            },
            Reviews = reviews,
        };

        return Result.Success(model);
    }
}
