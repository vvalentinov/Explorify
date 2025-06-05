using System.Data;

using Explorify.Application.Place;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Dapper;

namespace Explorify.Application.FavPlace.GetFavPlaces;

public class GetFavPlacesQueryHandler :
    IQueryHandler<GetFavPlacesQuery, PlacesListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetFavPlacesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetFavPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = request.CurrentUserId;
        var page = request.Page;

        var sql =
            """
            
            SELECT
                p.Id,
                p.Name,
                p.SlugifiedName,
                p.ThumbUrl as ImageUrl,
                p.IsDeleted
            FROM Places AS p
            WHERE p.Id IN (SELECT fp.PlaceId FROM FavoritePlaces AS fp WHERE fp.UserId = @CurrentUserId) AND p.IsApproved AND p.IsDeleted = 0
            ORDER BY CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
            
            """
         ;

        string countSql =
           $"""
                SELECT
                    COUNT(*)
                FROM FavoritePlaces AS fp
                JOIN Places AS p ON fp.PlaceId = p.Id
                WHERE fp.UserId = @CurrentUserId AND p.IsApproved = 1 AND p.IsDeleted = 0;
            """
        ;

        int offset = (page - 1) * PlacesPerPageCount;

        var parameters = new
        {
            Offset = offset,
            PageSize = PlacesPerPageCount,
            CurrentUserId = currentUserId,
        };

        var favPlaces = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(sql, parameters);
        int recordsCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, parameters);

        var response = new PlacesListResponseModel
        {
            Places = favPlaces,
            Pagination = new PaginationResponseModel
            {
                PageNumber = page,
                RecordsCount = recordsCount,
                ItemsPerPage = PlacesPerPageCount,
            },
        };

        return Result.Success(response);
    }
}
