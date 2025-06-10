using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.User.GetProfileInfo;

public class GetProfileInfoQueryHandler
    : IQueryHandler<GetProfileInfoQuery, GetProfileInfoResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetProfileInfoQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetProfileInfoResponseModel>> Handle(
        GetProfileInfoQuery request,
        CancellationToken cancellationToken)
    {
        var userId = request.UserId;

        var sql =
            """
            
            SELECT 
                u.Id AS UserId,
                u.UserName,
                u.ProfileImageUrl,
                u.Bio,
                u.Points,
                (SELECT COUNT(*) FROM UserFollows WHERE FolloweeId = u.Id AND IsDeleted = 0) AS FollowersCount,
                (SELECT COUNT(*) FROM UserFollows WHERE FollowerId = u.Id AND IsDeleted = 0) AS FollowingCount,
                (
                    SELECT COUNT(*) 
                    FROM Places
                    WHERE UserId = u.Id AND IsApproved = 1 AND IsDeleted = 0
                ) +
                (
                    SELECT COUNT(*)
                    FROM Reviews r
                    JOIN Places p ON r.PlaceId = p.Id
                    WHERE r.UserId = u.Id 
                      AND r.IsApproved = 1 
                      AND r.IsDeleted = 0
                      AND p.UserId <> u.Id
                ) AS Contributions,
                CASE 
                WHEN (
                    SELECT COUNT(*) 
                    FROM UserFollows 
                    WHERE FollowerId = @CurrentUserId 
                      AND FolloweeId = u.Id
                      AND IsDeleted = 0
                ) > 0 THEN CAST(1 AS BIT)
                ELSE CAST(0 AS BIT)
            END AS IsFollowedByCurrentUser
            FROM AspNetUsers AS u
            WHERE u.Id = @UserId
            

            """;

        var model = await _dbConnection.QuerySingleOrDefaultAsync<GetProfileInfoResponseModel>(
            sql,
            new { UserId = Guid.Parse(userId), request.CurrentUserId });

        if (model is null)
        {
            var error = new Error("No user was found!", ErrorType.Validation);
            return Result.Failure<GetProfileInfoResponseModel>(error);
        }

        return Result.Success(model);
    }
}
