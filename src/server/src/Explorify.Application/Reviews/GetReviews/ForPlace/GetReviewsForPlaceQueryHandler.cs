using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Dapper;

namespace Explorify.Application.Reviews.GetReviews.ForPlace;

public class GetReviewsForPlaceQueryHandler
    : IQueryHandler<GetReviewsForPlaceQuery, ReviewsListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetReviewsForPlaceQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetReviewsForPlaceQuery request,
        CancellationToken cancellationToken)
    {
        var placeId = request.PlaceId;
        var page = request.Page;
        var order = request.Order;
        var currentUserId = request.CurrentUserId;

        var offset = (page - 1) * ReviewsPerPageCount;
        var take = ReviewsPerPageCount;

        var orderBy = order switch
        {
            ReviewsOrderEnum.Newest => "r.CreatedOn DESC",
            ReviewsOrderEnum.Oldest => "r.CreatedOn ASC",
            ReviewsOrderEnum.MostHelpful => "r.Likes DESC",
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
                r.CreatedOn,
                u.UserName,
                u.ProfileImageUrl,
                p.Name AS PlaceName,
                CASE WHEN rl.UserId IS NULL THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS HasLikedReview
            FROM Reviews r
            JOIN AspNetUsers u ON r.UserId = u.Id
            JOIN Places p ON r.PlaceId = p.Id
            LEFT JOIN ReviewsLikes rl ON rl.ReviewId = r.Id AND rl.UserId = @CurrentUserId
            WHERE r.PlaceId = @PlaceId
              AND r.IsApproved = 1
              AND r.IsDeleted = 0
              AND r.UserId != (SELECT UserId FROM Places WHERE Id = @PlaceId)
            ORDER BY {orderBy}
            OFFSET @Offset ROWS FETCH NEXT @Take ROWS ONLY;

            SELECT COUNT(*)
            FROM Reviews r
            JOIN Places p ON r.PlaceId = p.Id
            WHERE r.PlaceId = @PlaceId
              AND r.IsApproved = 1
              AND r.IsDeleted = 0
              AND r.UserId != (SELECT UserId FROM Places WHERE Id = @PlaceId);

            """;

        var parameters = new
        {
            PlaceId = placeId,
            CurrentUserId = currentUserId,
            Offset = offset,
            Take = take,
        };

        using var multi = await _dbConnection.QueryMultipleAsync(sql, parameters);

        var reviews = (await multi.ReadAsync<ReviewResponseModel>()).ToList();
        var recordsCount = await multi.ReadFirstAsync<int>();

        var reviewIds = reviews.Select(r => r.Id).ToList();

        if (reviewIds.Count > 0)
        {
            var photos = await _dbConnection.QueryAsync<(Guid ReviewId, string Url)>(
            "SELECT ReviewId, Url FROM ReviewPhotos WHERE ReviewId IN @ReviewIds",
            new { ReviewIds = reviewIds }
            );

            var lookup = photos
                .GroupBy(p => p.ReviewId)
                .ToDictionary(g => g.Key, g => g.Select(p => p.Url));

            foreach (var review in reviews)
            {
                review.ImagesUrls = lookup.TryGetValue(review.Id, out var urls) ? urls : [];
            }
        }
        
        var responseModel = new ReviewsListResponseModel
        {

            Reviews = reviews,
            Pagination = new PaginationResponseModel
            {
                RecordsCount = recordsCount,
                PageNumber = request.Page,
                ItemsPerPage = ReviewsPerPageCount,
            }
        };

        return Result.Success(responseModel);
    }
}
