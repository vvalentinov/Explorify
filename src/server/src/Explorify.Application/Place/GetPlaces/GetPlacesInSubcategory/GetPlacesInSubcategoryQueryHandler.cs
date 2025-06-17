using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Dapper;

namespace Explorify.Application.Place.GetPlaces.GetPlacesInSubcategory;

public class GetPlacesInSubcategoryQueryHandler
    : IQueryHandler<GetPlacesInSubcategoryQuery, PlacesListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetPlacesInSubcategoryQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetPlacesInSubcategoryQuery request,
        CancellationToken cancellationToken)
    {
        var offset = request.Page * PlacesPerPageCount - PlacesPerPageCount;

        var sql = @"
            SELECT 
                p.Id,
                p.Name,
                p.SlugifiedName,
                p.ThumbUrl AS ImageUrl,
                p.UserId,
                ISNULL(AVG(CAST(r.Rating AS FLOAT)), 0) AS AverageRating,
                CASE WHEN fp.PlaceId IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS IsFavorite
            FROM Places p
            LEFT JOIN Reviews r ON r.PlaceId = p.Id AND r.IsApproved = 1
            LEFT JOIN FavoritePlaces fp ON fp.PlaceId = p.Id AND fp.UserId = @CurrentUserId
            WHERE p.IsApproved = 1 AND p.CategoryId = @SubcategoryId AND p.IsDeleted = 0
            GROUP BY p.Id, p.Name, p.SlugifiedName, p.ThumbUrl, p.UserId, fp.PlaceId
            ORDER BY p.Name
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

            SELECT COUNT(1)
            FROM Places p
            WHERE p.IsApproved = 1 AND p.CategoryId = @SubcategoryId AND p.IsDeleted = 0;
        ";

        using var multi = await _dbConnection.QueryMultipleAsync(sql, new
        {
            request.SubcategoryId,
            Offset = offset,
            PageSize = PlacesPerPageCount,
            request.CurrentUserId
        });

        var places = (await multi.ReadAsync<PlaceDisplayResponseModel>()).ToList();
        var recordsCount = await multi.ReadSingleAsync<int>();

        var responseModel = new PlacesListResponseModel
        {
            Places = places,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                RecordsCount = recordsCount,
                ItemsPerPage = PlacesPerPageCount,
            },
        };

        return Result.Success(responseModel);
    }
}
