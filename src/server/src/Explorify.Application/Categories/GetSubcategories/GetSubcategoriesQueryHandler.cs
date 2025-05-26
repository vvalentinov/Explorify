using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.CategoryConstants.ErrorMessages;

using Dapper;

namespace Explorify.Application.Categories.GetSubcategories;

public class GetSubcategoriesQueryHandler
    : IQueryHandler<GetSubcategoriesQuery, SubcategoriesResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetSubcategoriesQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<SubcategoriesResponseModel>> Handle(
        GetSubcategoriesQuery request,
        CancellationToken cancellationToken)
    {
        const string categorySql =
            """
            
            SELECT
                Id,
                Name,
                Description
            FROM Categories
            WHERE Id = @CategoryId
        
            """;

        const string subcategoriesSql =
            """
            
            SELECT
                Id,
                Name,
                SlugifiedName,
                ImageUrl
            FROM Categories
            WHERE ParentId = @CategoryId
        
            """
        ;

        var category = await _dbConnection.QueryFirstOrDefaultAsync(categorySql, new
        {
            request.CategoryId
        });

        if (category == null)
        {
            var error = new Error(NoCategoryWithIdError, ErrorType.Validation);
            return Result.Failure<SubcategoriesResponseModel>(error);
        }

        var subcategories = await _dbConnection.QueryAsync<CategoryResponseModel>(subcategoriesSql, new
        {
            request.CategoryId
        });

        var subcategoriesResponse = new SubcategoriesResponseModel
        {
            CategoryName = category.Name,
            Subcategories = subcategories,
            CategoryDescription = category.Description ?? string.Empty,
        };

        return Result.Success(subcategoriesResponse);
    }
}
