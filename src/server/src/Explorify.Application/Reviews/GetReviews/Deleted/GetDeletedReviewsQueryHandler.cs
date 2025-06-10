using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Dapper;

namespace Explorify.Application.Reviews.GetReviews.Deleted;

public class GetDeletedReviewsQueryHandler
    : IQueryHandler<GetDeletedReviewsQuery, ReviewsListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetDeletedReviewsQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetDeletedReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = request.CurrentUserId;
        var isCurrentUserAdmin = request.IsCurrUserAdmin;
        var page = request.Page;
        var isForAdmin = request.IsForAdmin;

        if (isForAdmin && !isCurrentUserAdmin)
        {
            var error = new Error("Only admins can access all recently deleted reviews.", ErrorType.Validation);
            return Result.Failure<ReviewsListResponseModel>(error);
        }

        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var orderBy = request.Order switch
        {
            OrderEnum.Newest => "r.CreatedOn DESC",
            OrderEnum.Oldest => "r.CreatedOn ASC",
            OrderEnum.MostHelpful => "r.Likes DESC",
            _ => "r.CreatedOn DESC"
        };

        var sql =
            $"""

            SELECT 
                r.Id,
                r.Rating,
                r.Content,
                r.Likes,
                r.UserId,
                r.IsApproved,
                r.IsDeleted,
                r.IsDeletedByAdmin,
                r.CreatedOn,
                p.Name AS PlaceName,
                u.UserName,
                u.ProfileImageUrl
            FROM Reviews r
            JOIN Places p ON r.PlaceId = p.Id
            JOIN AspNetUsers u ON r.UserId = u.Id
            WHERE r.IsDeleted = 1 AND r.IsCleaned = 0
              -- AND r.DeletedOn >= @CutoffTime
              AND (
                (@IsAdmin = 1 AND r.UserId != p.UserId)
                OR
                (@IsAdmin = 0 AND r.UserId = @CurrentUserId AND p.UserId != @CurrentUserId)
              ) AND (@HasStarsFilter = 0 OR r.Rating IN @StarsFilter)
            ORDER BY {orderBy}
            OFFSET @Offset ROWS FETCH NEXT @Take ROWS ONLY;

            SELECT
                COUNT(*)
            FROM Reviews r
            JOIN Places p ON r.PlaceId = p.Id
            WHERE r.IsDeleted = 1 AND r.IsCleaned = 0
              -- AND r.DeletedOn >= @CutoffTime
              AND (
                (@IsAdmin = 1 AND r.UserId != p.UserId)
                OR
                (@IsAdmin = 0 AND r.UserId = @CurrentUserId AND p.UserId != @CurrentUserId)
              ) AND (@HasStarsFilter = 0 OR r.Rating IN @StarsFilter);
            """;

        var starsFilterList = request.StarFilters?.ToList() ?? new List<int>();

        var parameters = new
        {
            currentUserId,
            IsAdmin = isForAdmin && isCurrentUserAdmin,
            //CutoffTime = cutoff,
            Offset = (request.Page - 1) * ReviewsPerPageCount,
            Take = ReviewsPerPageCount,
            StarsFilter = starsFilterList,
            HasStarsFilter = starsFilterList.Count != 0 ? 1 : 0
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
                RecordsCount = recordsCount
            }
        };

        return Result.Success(model);
    }
}
