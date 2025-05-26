using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants;

using Dapper;

namespace Explorify.Application.Place.GetPlaces.GetApproved;

public class GetApprovedPlacesQueryHandler
    : IQueryHandler<GetApprovedPlacesQuery, PlacesListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetApprovedPlacesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        GetApprovedPlacesQuery request,
        CancellationToken cancellationToken)
    {
        var page = request.Page;
        var isForAdmin = request.IsForAdmin;
        var currUserId = request.CurrentUserId;

        string additionalFilter = isForAdmin
            ? string.Empty
            : "AND UserId = @CurrentUserId";

        string dataSql = 
            $"""

                SELECT
                    Id AS {nameof(PlaceDisplayResponseModel.Id)},
                    Name AS {nameof(PlaceDisplayResponseModel.Name)},
                    ThumbUrl AS {nameof(PlaceDisplayResponseModel.ImageUrl)},
                    SlugifiedName AS {nameof(PlaceDisplayResponseModel.SlugifiedName)},
                    IsDeleted AS {nameof(PlaceDisplayResponseModel.IsDeleted)}
                FROM Places
                WHERE IsApproved = 1 AND IsDeleted = 0 AND IsCleaned = 0
                {additionalFilter}
                ORDER BY CreatedOn DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

        """;

        string countSql = 
            $"""
                SELECT COUNT(*)
                FROM Places
                WHERE IsApproved = 1 AND IsDeleted = 0 AND IsCleaned = 0
                {additionalFilter};
            """;

        int offset = (page - 1) * PlacesPerPageCount;

        var parameters = new
        {
            Offset = offset,
            PageSize = PlacesPerPageCount,
            CurrentUserId = currUserId
        };

        var approvedPlaces = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(
            dataSql, parameters);

        int recordsCount = await _dbConnection.ExecuteScalarAsync<int>(
            countSql, parameters);

        var response = new PlacesListResponseModel
        {
            Places = approvedPlaces,
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
