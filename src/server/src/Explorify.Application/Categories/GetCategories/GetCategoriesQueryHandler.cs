using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Categories.GetCategories;

public class GetCategoriesQueryHandler
    : IQueryHandler<GetCategoriesQuery, IEnumerable<CategoryResponseModel>>
{
    private readonly IDbConnection _dbConnection;

    public GetCategoriesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<IEnumerable<CategoryResponseModel>>> Handle(
        GetCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        var categoriesSql =
            """
            SELECT
                Id,
                Name,
                SlugifiedName,
                ImageUrl,
                Description
            FROM Categories
            WHERE ParentId IS NULL
            """;

        var categories = await _dbConnection.QueryAsync<CategoryResponseModel>(categoriesSql);

        return Result.Success(categories);
    }
}
