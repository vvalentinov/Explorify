using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Admin.GetDashboardInfo;

public class GetDashboardInfoQueryHandler
    : IQueryHandler<GetDashboardInfoQuery, GetDashboardInfoResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetDashboardInfoQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetDashboardInfoResponseModel>> Handle(
        GetDashboardInfoQuery request,
        CancellationToken cancellationToken)
    {
        var sql =
            """
            SELECT
                (SELECT COUNT(*) FROM Places WHERE IsApproved = 0 AND IsDeleted = 0) AS UnapprovedPlacesNumber,
                (
                    SELECT COUNT(*)
                    FROM Reviews r
                    JOIN Places p ON r.PlaceId = p.Id
                    WHERE r.IsApproved = 0 AND r.IsDeleted = 0
                      AND r.UserId != p.UserId
                ) AS UnapprovedReviewsNumber,
                (SELECT COUNT(*) FROM AspNetUsers) AS RegisteredUsersNumber;
            """;

        var counts = await _dbConnection.QueryFirstAsync<GetDashboardInfoResponseModel>(sql);

        var responseModel = new GetDashboardInfoResponseModel
        {
            RegisteredUsersNumber = counts.RegisteredUsersNumber,
            UnapprovedPlacesNumber = counts.UnapprovedPlacesNumber,
            UnapprovedReviewsNumber = counts.UnapprovedReviewsNumber,
        };

        return Result.Success(responseModel);
    }
}
