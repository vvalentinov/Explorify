using System.Data;

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
               	Id,
               	[Name],
               	SlugifiedName,
               	ThumbUrl as ImageUrl,
               	IsDeleted
            FROM Places
            WHERE IsDeleted = 0 AND IsApproved = 1
            ORDER BY CreatedOn DESC
            
            """;

        var highestRatedPlacesSql =
            """
            
            SELECT TOP 6
                p.Id,
                p.[Name],
                p.SlugifiedName,
                p.ThumbUrl AS ImageUrl,
                p.IsDeleted,
                AVG(CAST(r.Rating AS FLOAT)) AS AverageRating
            FROM Places AS p
            JOIN Reviews AS r ON p.Id = r.PlaceId
            WHERE p.IsDeleted = 0 AND r.IsApproved = 1
            GROUP BY
                p.Id,
                p.[Name],
                p.SlugifiedName,
                p.ThumbUrl,
                p.IsDeleted
            ORDER BY AVG(CAST(r.Rating AS FLOAT)) DESC;
            
            """;

        var recentPlaces = await _dbConnection.QueryAsync<HomePlaceDisplayResponseModel>(recentPlacesSql);

        var highestRatedPlaces = await _dbConnection.QueryAsync<HomePlaceDisplayResponseModel>(highestRatedPlacesSql);

        var response = new GetHomeDataResponseModel
        {
            RecentPlaces = recentPlaces,
            HighestRatedPlaces = highestRatedPlaces,
        };

        return Result.Success(response);
    }
}
