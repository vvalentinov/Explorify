using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.UserFollow.GetFollowedUsers;

public class GetFollowedUsersQueryHandler :
    IQueryHandler<GetFollowedUsersQuery, GetFollowedUsersDto>
{
    private readonly IDbConnection _dbConnection;

    public GetFollowedUsersQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetFollowedUsersDto>> Handle(
        GetFollowedUsersQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = request.CurrentUserId;
        var page = request.Page;
        var sortDirection = request.SortDirection.Equals("desc", StringComparison.CurrentCultureIgnoreCase) ? "DESC" : "ASC";

        var hasUserNameFilter = !string.IsNullOrWhiteSpace(request.UserName);
        var userNameFilterSql = hasUserNameFilter ? "AND ru.UserName LIKE @UserName" : string.Empty;

        const int PageSize = 6;
        var offset = (page - 1) * PageSize;

        var sql = $@"
            WITH RankedUsers AS (
                SELECT 
                    u.Id,
                    u.UserName,
                    u.ProfileImageUrl,
                    u.Points,
                    ROW_NUMBER() OVER (ORDER BY u.Points DESC) AS Rank
                FROM AspNetUsers u
            )

            SELECT 
                ru.Id,
                ru.UserName,
                ru.ProfileImageUrl,
                ru.Points,
                ru.Rank,
                (
                    SELECT COUNT(*) 
                    FROM Places p 
                    WHERE p.UserId = ru.Id AND p.IsApproved = 1 AND p.IsDeleted = 0
                ) AS PlacesCount,
                (
                    SELECT COUNT(*) 
                    FROM Reviews r 
                    WHERE r.UserId = ru.Id AND r.IsApproved = 1 AND r.IsDeleted = 0
                ) AS ReviewsCount
            FROM RankedUsers ru
            JOIN UserFollows f ON f.FolloweeId = ru.Id
            WHERE f.FollowerId = @CurrentUserId AND f.IsDeleted = 0
            {userNameFilterSql}
            ORDER BY ru.Rank {sortDirection}
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

            WITH RankedUsers AS (
                SELECT 
                    u.Id,
                    u.UserName,
                    u.ProfileImageUrl,
                    u.Points,
                    ROW_NUMBER() OVER (ORDER BY u.Points DESC) AS Rank
                FROM AspNetUsers u
            )

            SELECT COUNT(*) 
            FROM RankedUsers ru
            JOIN UserFollows f ON f.FolloweeId = ru.Id
            WHERE f.FollowerId = @CurrentUserId AND f.IsDeleted = 0
            {userNameFilterSql};
        ";

        using var multi = await _dbConnection.QueryMultipleAsync(sql, new
        {
            request.CurrentUserId,
            Offset = offset,
            PageSize,
            UserName = hasUserNameFilter ? $"%{request.UserName}%" : null
        });

        var users = (await multi.ReadAsync<FollowedUserDto>()).ToList();
        var totalCount = await multi.ReadFirstAsync<int>();

        var response = new GetFollowedUsersDto
        {
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = PageSize,
                PageNumber = page,
                RecordsCount = totalCount,
            },
            Users = users,
        };

        return Result.Success(response);
    }
}
