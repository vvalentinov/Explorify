using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.User.Account.GetBio;

public class GetBioQueryHandler
    : IQueryHandler<GetBioQuery, GetBioResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetBioQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetBioResponseModel>> Handle(
        GetBioQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = request.UserId;

        const string sql =
            """
            SELECT
                Bio
            FROM AspNetUsers
            WHERE Id = @CurrentUserId

            """;

        var bio = await _dbConnection.QueryFirstAsync<string>(
            sql,
            new { CurrentUserId = currentUserId });

        var responseModel = new GetBioResponseModel
        {
            Bio = bio
        };

        return Result.Success(responseModel);
    }
}
