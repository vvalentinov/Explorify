using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Leaderboard;

public class GetLeaderboardQueryHandler
    : IQueryHandler<GetLeaderboardQuery, LeaderboardResult>
{
    private readonly IDbConnection _dbConnection;

    public GetLeaderboardQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<LeaderboardResult>> Handle(
        GetLeaderboardQuery request,
        CancellationToken cancellationToken)
    {
        const int UsersPerPage = 6;

        const string sql =
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
                r.Id,
                r.UserName,
                r.ProfileImageUrl,
                r.Points,
                r.Bio,
                r.Rank,
                (
                    SELECT COUNT(*) 
                    FROM Places AS p 
                    WHERE p.UserId = r.Id AND p.IsApproved = 1 AND p.IsDeleted = 0
                ) AS PlacesCount,
                (
                    SELECT COUNT(*) 
                    FROM Reviews AS rv 
                    WHERE rv.UserId = r.Id AND rv.IsApproved = 1 AND rv.IsDeleted = 0
                ) AS ReviewsCount
            FROM RankedUsers r
            ORDER BY r.Rank
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

            SELECT COUNT(*) FROM AspNetUsers;
            
            """;

        var offset = request.Page * UsersPerPage - UsersPerPage;

        var parameters = new
        {
            Offset = offset,
            PageSize = UsersPerPage,
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
