using System.Data;

using Explorify.Application.Place;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Home;

public class GetHomeDataQueryHandler
    : IQueryHandler<GetHomeDataQuery, GetHomeDataResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetHomeDataQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetHomeDataResponseModel>> Handle(
        GetHomeDataQuery request,
        CancellationToken cancellationToken)
    {
        var recentPlacesSql =
            """
            
            SELECT TOP 6
               	p.Id,
               	p.[Name],
               	p.SlugifiedName,
               	p.ThumbUrl as ImageUrl,
               	p.IsDeleted,
                p.CreatedOn,
                p.UserId,
                AVG(CAST(r.Rating AS FLOAT)) AS AverageRating,
                CASE WHEN MAX(fp.PlaceId) IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS IsFavorite
            FROM Places AS p
            JOIN Reviews AS r ON p.Id = r.PlaceId AND r.IsApproved = 1
            LEFT JOIN FavoritePlaces fp ON fp.PlaceId = p.Id AND fp.UserId = @CurrentUserId
            WHERE p.IsDeleted = 0 AND p.IsApproved = 1
            GROUP BY
                p.Id,
                p.[Name],
                p.SlugifiedName,
                p.ThumbUrl,
                p.IsDeleted,
                p.CreatedOn,
                p.UserId
            ORDER BY p.CreatedOn DESC
            
            """;

        var highestRatedPlacesSql =
            """
            
            SELECT TOP 6
                p.Id,
                p.[Name],
                p.SlugifiedName,
                p.ThumbUrl AS ImageUrl,
                p.IsDeleted,
                p.UserId,
                AVG(CAST(r.Rating AS FLOAT)) AS AverageRating,
                CASE WHEN MAX(fp.PlaceId) IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS IsFavorite
            FROM Places AS p
            JOIN Reviews AS r ON p.Id = r.PlaceId
            LEFT JOIN FavoritePlaces fp ON fp.PlaceId = p.Id AND fp.UserId = @CurrentUserId
            WHERE p.IsDeleted = 0 AND r.IsApproved = 1
            GROUP BY
                p.Id,
                p.[Name],
                p.SlugifiedName,
                p.ThumbUrl,
                p.IsDeleted,
                p.UserId
            ORDER BY AVG(CAST(r.Rating AS FLOAT)) DESC;
            
            """;

        var parameters = new { request.CurrentUserId };

        var recentPlaces = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(
            recentPlacesSql,
            parameters);

        var highestRatedPlaces = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(
            highestRatedPlacesSql,
            parameters);

        var response = new GetHomeDataResponseModel
        {
            RecentPlaces = recentPlaces,
            HighestRatedPlaces = highestRatedPlaces,
        };

        return Result.Success(response);
    }
}
