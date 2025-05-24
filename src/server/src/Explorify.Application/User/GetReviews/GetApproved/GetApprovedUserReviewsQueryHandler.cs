using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.User.GetReviews.GetApproved;

public class GetApprovedUserReviewsQueryHandler
    : IQueryHandler<GetApprovedUserReviewsQuery, UserReviewsListResponseModel>
{
    private readonly IRepository _repository;

    public GetApprovedUserReviewsQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<UserReviewsListResponseModel>> Handle(
        GetApprovedUserReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Review>()
            .Include(review => review.Place)
            .Where(review =>
                review.IsApproved &&
                review.UserId == request.CurrentUserId &&
                review.Place.UserId != request.CurrentUserId &&
                !review.Place.IsDeleted);

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
