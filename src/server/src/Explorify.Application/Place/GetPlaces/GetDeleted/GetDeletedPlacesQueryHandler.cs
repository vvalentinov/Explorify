using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Dapper;

namespace Explorify.Application.Place.GetPlaces.GetDeleted;

public class GetDeletedPlacesQueryHandler
    : IQueryHandler<GetDeletedPlacesQuery, PlacesListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetDeletedPlacesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetDeletedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var page = request.Page;
        var isForAdmin = request.IsForAdmin;
        var currentUserId = request.CurrentUserId;

        var userFilter = isForAdmin ? string.Empty : "AND UserId = @CurrentUserId";

        // in the last 5 minutes
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var offset = (request.Page - 1) * PlacesPerPageCount;

        string dataSql = $"""
            SELECT
                Id,
                Name,
                ThumbUrl AS ImageUrl,
                SlugifiedName,
                IsDeleted
            FROM Places
            WHERE IsDeleted = 1 AND DeletedOn >= @Cutoff AND IsCleaned = 0
            {userFilter}
            ORDER BY CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
            """;

        string countSql = $"""
            SELECT COUNT(*)
            FROM Places
            WHERE IsDeleted = 1 AND DeletedOn >= @Cutoff AND IsCleaned = 0
            {userFilter};
            """;


        var parameters = new
        {
            Cutoff = DateTime.UtcNow.AddMinutes(-5),
            Offset = (request.Page - 1) * PlacesPerPageCount,
            PageSize = PlacesPerPageCount,
            CurrentUserId = currentUserId
        };

        var deletedPlaces = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(
            dataSql, parameters);

        var recordsCount = await _dbConnection.ExecuteScalarAsync<int>(
            countSql, parameters);

        var response = new PlacesListResponseModel
        {
            Places = deletedPlaces,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                RecordsCount = recordsCount,
                ItemsPerPage = PlacesPerPageCount,
            }
        };

        return Result.Success(response);
    }
}
