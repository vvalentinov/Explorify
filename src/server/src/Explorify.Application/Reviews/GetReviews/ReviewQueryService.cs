using System.Data;

using Dapper;

namespace Explorify.Application.Reviews.GetReviews;

public class ReviewQueryService : IReviewQueryService
{
    private readonly IDbConnection _dbConnection;

    public ReviewQueryService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<ReviewsListResponseModel> QueryReviewsAsync(
        IReviewQueryFilter filterStrategy,
        ReviewQueryContext context,
        bool includeLikeStatus = false)
    {
        var whereClause = filterStrategy.GetWhereClause();

        var orderBy = GetOrderByClause(context.Order);

        var selectFields =
            """
            
            r.Id,
            r.Rating,
            r.Content,
            r.Likes,
            r.UserId,
            r.CreatedOn,
            r.IsApproved,
            r.IsDeleted,
            r.IsDeletedByAdmin,
            u.UserName,
            u.ProfileImageUrl,
            p.Name AS PlaceName
        
            """;

        if (includeLikeStatus)
        {
            selectFields += ", CASE WHEN rl.UserId IS NULL THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS HasLikedReview";
        }

        var joins =
            """
            JOIN Places p ON r.PlaceId = p.Id
            JOIN AspNetUsers u ON r.UserId = u.Id
            """;

        if (includeLikeStatus)
        {
            joins += "\nLEFT JOIN ReviewsLikes rl ON rl.ReviewId = r.Id AND rl.UserId = @CurrentUserId";
        }

        var sql =
            $"""
            SELECT {selectFields}
            FROM Reviews r
            {joins}
            {whereClause}
            ORDER BY {orderBy}
            OFFSET @Offset ROWS FETCH NEXT @Take ROWS ONLY;

            SELECT COUNT(*)
            FROM Reviews r
            JOIN Places p ON r.PlaceId = p.Id
            {whereClause};
            """;

        var parameters = filterStrategy.GetParameters(context);

        using var multi = await _dbConnection.QueryMultipleAsync(sql, parameters);

        var reviews = (await multi.ReadAsync<ReviewResponseModel>()).ToList();
        var recordsCount = await multi.ReadFirstAsync<int>();

        await AttachReviewPhotosAsync(reviews);

        return new ReviewsListResponseModel
        {
            Reviews = reviews,
            Pagination = new PaginationResponseModel
            {
                PageNumber = context.Page,
                ItemsPerPage = context.ItemsPerPage,
                RecordsCount = recordsCount
            }
        };
    }

    private static string GetOrderByClause(OrderEnum order) => order switch
    {
        OrderEnum.Newest => "r.CreatedOn DESC",
        OrderEnum.Oldest => "r.CreatedOn ASC",
        OrderEnum.MostHelpful => "r.Likes DESC",
        _ => "r.CreatedOn DESC"
    };

    private async Task AttachReviewPhotosAsync(List<ReviewResponseModel> reviews)
    {
        if (reviews.Count == 0)
        {
            return;
        }

        var reviewIds = reviews.Select(r => r.Id).ToList();

        var photos = await _dbConnection.QueryAsync<(Guid ReviewId, string Url)>(
            """
            SELECT ReviewId, Url
            FROM ReviewPhotos
            WHERE ReviewId IN @ReviewIds AND (IsDeleted = 0 OR IsDeleted IS NULL)
            """,
            new { ReviewIds = reviewIds });

        var photoLookup = photos
            .GroupBy(p => p.ReviewId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Url).ToList());

        foreach (var review in reviews)
        {
            review.ImagesUrls = photoLookup.TryGetValue(review.Id, out var urls)
                ? urls
                : Enumerable.Empty<string>();
        }
    }
}
