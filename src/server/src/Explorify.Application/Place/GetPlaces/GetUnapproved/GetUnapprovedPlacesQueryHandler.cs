using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Dapper;

namespace Explorify.Application.Place.GetPlaces.GetUnapproved;

public class GetUnapprovedPlacesQueryHandler
    : IQueryHandler<GetUnapprovedPlacesQuery, PlacesListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetUnapprovedPlacesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetUnapprovedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var page = request.Page;
        var isForAdmin = request.IsForAdmin;
        var currentUserId = request.CurrentUserId;

        var filterByUser = !isForAdmin ? "AND UserId = @CurrentUserId" : string.Empty;

        string dataSql = $"""
            SELECT
                Id,
                Name,
                ThumbUrl AS ImageUrl,
                SlugifiedName
            FROM Places
            WHERE IsApproved = 0 AND IsDeleted = 0 AND IsCleaned = 0
            {filterByUser}
            ORDER BY CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
            """;

        string countSql = $"""
            SELECT COUNT(*)
            FROM Places
            WHERE IsApproved = 0 AND IsDeleted = 0 AND IsCleaned = 0
            {filterByUser};
            """;

        var offset = (page - 1) * PlacesPerPageCount;

        var parameters = new
        {
            Offset = offset,
            PageSize = PlacesPerPageCount,
            CurrentUserId = currentUserId
        };

        var unapprovedPlaces = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(
            dataSql, parameters);

        var recordsCount = await _dbConnection.ExecuteScalarAsync<int>(
            countSql, parameters);

        var response = new PlacesListResponseModel
        {
            Places = unapprovedPlaces,
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
