using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Dapper;

namespace Explorify.Application.Reviews.GetReviews.Unapproved;

public class GetUnapprovedReviewsQueryHandler
    : IQueryHandler<GetUnapprovedReviewsQuery, ReviewsListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetUnapprovedReviewsQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetUnapprovedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = request.CurrentUserId;
        var isCurrentUserAdmin = request.IsCurrUserAdmin;
        var page = request.Page;
        var isForAdmin = request.IsForAdmin;

        var sql =
            """
            -- Unapproved Reviews

            SELECT 
                r.Id,
                r.Rating,
                r.Content,
                r.Likes,
                r.UserId,
                r.IsApproved,
                r.IsDeleted,
                r.IsDeletedByAdmin,
                p.Name AS PlaceName,
                u.UserName,
                u.ProfileImageUrl
            FROM Reviews r
            JOIN Places p ON r.PlaceId = p.Id
            JOIN AspNetUsers u ON r.UserId = u.Id
            WHERE r.IsApproved = 0 AND p.IsDeleted = 0 AND r.IsDeleted = 0
              AND (
                (@IsAdmin = 1 AND r.UserId != p.UserId)
                OR
                (@IsAdmin = 0 AND r.UserId = @CurrentUserId AND p.UserId != @CurrentUserId)
              )
            ORDER BY r.CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @Take ROWS ONLY;

            -- Total Count

            SELECT COUNT(*) FROM Reviews r
            JOIN Places p ON r.PlaceId = p.Id
            WHERE r.IsApproved = 0 AND p.IsDeleted = 0
              AND (
                (@IsAdmin = 1 AND r.UserId != p.UserId)
                OR
                (@IsAdmin = 0 AND r.UserId = @CurrentUserId AND p.UserId != @CurrentUserId)
              );
            """;

        var parameters = new
        {
            currentUserId,
            IsAdmin = isForAdmin && isCurrentUserAdmin,
            Offset = (request.Page - 1) * ReviewsPerPageCount,
            Take = ReviewsPerPageCount,
        };

        using var multi = await _dbConnection.QueryMultipleAsync(sql, parameters);

        var reviews = (await multi.ReadAsync<ReviewResponseModel>()).ToList();
        var recordsCount = await multi.ReadFirstAsync<int>();

        var reviewIds = reviews.Select(r => r.Id).ToList();

        var photos = await _dbConnection.QueryAsync<(Guid ReviewId, string Url)>(
            "SELECT ReviewId, Url FROM ReviewPhotos WHERE ReviewId IN @ReviewIds AND (IsDeleted = 0 OR IsDeleted IS NULL)",
            new { ReviewIds = reviewIds }
        );

        var photoLookup = photos
            .GroupBy(p => p.ReviewId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Url).ToList());

        foreach (var review in reviews)
        {
            review.ImagesUrls = photoLookup.TryGetValue(review.Id, out var urls)
                ? urls
                : Enumerable.Empty<string>();
        }

        var model = new ReviewsListResponseModel
        {
            Reviews = reviews,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                ItemsPerPage = ReviewsPerPageCount,
                RecordsCount = recordsCount,
            }
        };

        return Result.Success(model);
    }
}
