using System.Data;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ReviewConstants;

using Dapper;

namespace Explorify.Application.Notification.GetUserNotifications;

public class GetUserNotificationsQueryHandler
    : IQueryHandler<GetUserNotificationsQuery, NotificationListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetUserNotificationsQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<NotificationListResponseModel>> Handle(
        GetUserNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        const string countSql = @"
            SELECT COUNT(*)
            FROM Notifications
            WHERE ReceiverId = @UserId AND IsDeleted = 0";

        const string dataSql = @"
            SELECT
                Id,
                Content,
                IsRead,
                CreatedOn
            FROM Notifications
            WHERE ReceiverId = @UserId AND IsDeleted = 0
            ORDER BY CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var parameters = new
        {
            request.UserId,
            PageSize = ReviewsPerPageCount,
            Offset = (request.Page - 1) * ReviewsPerPageCount,
        };

        var recordsCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, parameters);

        var notifications = await _dbConnection.QueryAsync<NotificationResponseModel>(dataSql, parameters);

        var responseModel = new NotificationListResponseModel
        {
            Notifications = notifications,
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = ReviewsPerPageCount,
                PageNumber = request.Page,
                RecordsCount = recordsCount,
            }
        };

        return Result.Success(responseModel);
    }
}
