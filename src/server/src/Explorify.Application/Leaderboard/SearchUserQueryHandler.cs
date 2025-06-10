using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Leaderboard;

public class SearchUserQueryHandler
    : IQueryHandler<SearchUserQuery, LeaderboardResult>
{
    private readonly IDbConnection _dbConnection;

    public SearchUserQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<LeaderboardResult>> Handle(
        SearchUserQuery request,
        CancellationToken cancellationToken)
    {
        const int UsersPerPage = 6;

        var sql =
            """

            WITH RankedUsers AS (
                SELECT 
                    u.Id,
                    u.UserName,
                    u.ProfileImageUrl,
                    u.Points,
                    u.Bio,
                    ROW_NUMBER() OVER (ORDER BY u.Points DESC) AS Rank
                FROM AspNetUsers u
            )
            
            SELECT 
                u.Id,
                u.UserName,
                u.ProfileImageUrl,
                u.Points,
                u.Bio,
                u.Rank,
                (
                    SELECT COUNT(*) FROM Places AS p WHERE p.UserId = u.Id AND p.IsApproved = 1 AND p.IsDeleted = 0
                ) AS PlacesCount,
                (
                    SELECT COUNT(*) FROM Reviews AS r WHERE r.UserId = u.Id AND r.IsApproved = 1 AND r.IsDeleted = 0
                ) AS ReviewsCount
            FROM RankedUsers u
            WHERE u.UserName LIKE @UserNameFilter
            ORDER BY u.Rank
            OFFSET @Offset ROWS
            FETCH NEXT @PageSize ROWS ONLY;

            SELECT COUNT(*) FROM AspNetUsers WHERE UserName LIKE @UserNameFilter;
            
            """;

        var offset = request.Page * UsersPerPage - UsersPerPage;

        var parameters = new
        {
            Offset = offset,
            PageSize = 6,
            UserNameFilter = $"%{request.UserNameFilter}%"
        };

        using var multi = await _dbConnection.QueryMultipleAsync(sql, parameters);

        var users = (await multi.ReadAsync<LeaderboardUserDto>()).ToList();
        var totalCount = await multi.ReadFirstAsync<int>();

        var result = new LeaderboardResult
        {
            Users = users,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                RecordsCount = totalCount,
                ItemsPerPage = UsersPerPage,
            },
        };

        return Result.Success(result);
    }
}
