using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.User.GetReviews.GetUnapproved;

public class GetUnapprovedUserReviewsQueryHandler
    : IQueryHandler<GetUnapprovedUserReviewsQuery, UserReviewsListResponseModel>
{
    private readonly IRepository _repository;

    public GetUnapprovedUserReviewsQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<UserReviewsListResponseModel>> Handle(
        GetUnapprovedUserReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
           .AllAsNoTracking<Review>()
           .Include(x => x.Place)
           .Where(x =>
               !x.IsApproved &&
               x.UserId == request.CurrentUserId &&
               x.Place.UserId != request.CurrentUserId);

        var recordsCount = await query.CountAsync(cancellationToken);

        var reviews = await query
            .Skip((request.Page - 1) * ReviewsPerPageCount)
            .Take(ReviewsPerPageCount)
            .OrderByDescending(x => x.CreatedOn)
            .Select(x => new UserReviewResponseModel
            {
                Id = x.Id,
                Content = x.Content,
                Likes = x.Likes,
                Rating = x.Rating,
                PlaceName = x.Place.Name,
                ImagesUrls = x.Photos.Select(x => x.Url),
            }).ToListAsync(cancellationToken);

        var model = new UserReviewsListResponseModel
        {
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = ReviewsPerPageCount,
                PageNumber = request.Page,
                RecordsCount = recordsCount,
            },
            Reviews = reviews,
        };

        return Result.Success(model);
    }
}
