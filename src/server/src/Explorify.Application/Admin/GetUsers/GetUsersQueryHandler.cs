using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Admin.GetUsers;

public class GetUsersQueryHandler
    : IQueryHandler<GetUsersQuery, GetUsersQueryDto>
{
    private readonly IDbConnection _dbConnection;

    public GetUsersQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetUsersQueryDto>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken)
    {
        var offset = (request.Page * 6) - 6;

        var sql = @"
            SELECT u.Id, u.UserName, u.Email, ISNULL(r.Name, 'User') AS Role, u.ProfileImageUrl
            FROM AspNetUsers u
            LEFT JOIN AspNetUserRoles ur ON u.Id = ur.UserId
            LEFT JOIN AspNetRoles r ON ur.RoleId = r.Id
            ORDER BY u.UserName
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

            SELECT COUNT(*) FROM AspNetUsers;
        ";

        using var multi = await _dbConnection.QueryMultipleAsync(
            sql,
            new { Offset = offset, PageSize = 6 });

        var users = (await multi.ReadAsync<UserDetailsDto>()).ToList();
        var totalCount = await multi.ReadSingleAsync<int>();

        var pagination = new PaginationResponseModel
        {
            RecordsCount = totalCount,
            ItemsPerPage = 6,
            PageNumber = request.Page
        };

        var result = new GetUsersQueryDto
        {
            Pagination = pagination,
            Users = users,
        };

        return Result.Success(result);
    }
}
