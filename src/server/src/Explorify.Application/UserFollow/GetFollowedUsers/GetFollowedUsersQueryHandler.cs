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

        const int PageSize = 6;

        var offset = (page - 1) * PageSize;

        const string sql = @"
            SELECT 
                u.Id,
                u.UserName,
                u.ProfileImageUrl
            FROM UserFollows f
            JOIN AspNetUsers u ON u.Id = f.FolloweeId
            WHERE f.FollowerId = @CurrentUserId AND f.IsDeleted = 0
            ORDER BY u.UserName
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
        ";

        var users = await _dbConnection.QueryAsync<UserDto>(sql, new
        {
            CurrentUserId = currentUserId,
            Offset = offset,
            PageSize
        });

        const string countSql = @"
            SELECT COUNT(*)
            FROM UserFollows
            WHERE FollowerId = @CurrentUserId AND IsDeleted = 0;
        ";

        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, new
        {
            CurrentUserId = currentUserId
        });

        var response = new GetFollowedUsersDto
        {
            Pagination = new PaginationResponseModel
            {
                ItemsPerPage = 6,
                PageNumber = page,
                RecordsCount = totalCount,
            },
            Users = users,
        };

        return Result.Success(response);
    }
}
