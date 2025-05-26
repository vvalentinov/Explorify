using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Notification.GetUnreadNotificationsCount;

public class GetUnreadNotificationsCountQueryHandler
    : IQueryHandler<GetUnreadNotificationsCountQuery, int>
{
    private readonly IDbConnection _dbConnection;

    public GetUnreadNotificationsCountQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<int>> Handle(
        GetUnreadNotificationsCountQuery request,
        CancellationToken cancellationToken)
    {
        var sql =
            """

            SELECT
            	COUNT(*)
            FROM Notifications
            WHERE ReceiverId = @UserId AND IsDeleted = 0 AND IsRead = 0
            
            """;

        var count = await _dbConnection.ExecuteScalarAsync<int>(sql, new { request.UserId });

        return Result.Success(count);
    }
}
