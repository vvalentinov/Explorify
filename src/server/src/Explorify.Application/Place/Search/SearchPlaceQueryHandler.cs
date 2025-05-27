using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

using static Explorify.Domain.Constants.PlaceConstants;

namespace Explorify.Application.Place.Search;

public class SearchPlaceQueryHandler
    : IQueryHandler<SearchPlaceQuery, PlacesListResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public SearchPlaceQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        SearchPlaceQuery request,
        CancellationToken cancellationToken)
    {
        var model = request.Model;

        var parameters = new DynamicParameters();

        var whereConditions = new List<string>();

        if (!string.IsNullOrWhiteSpace(model.Name))
        {
            whereConditions.Add("p.Name LIKE @Name");
            parameters.Add("Name", $"%{model.Name}%");
        }

        if (model.CountryId.HasValue)
        {
            whereConditions.Add("p.CountryId = @CountryId");
            parameters.Add("CountryId", model.CountryId);
        }

        if (model.CategoryId.HasValue && model.SubcategoryId.HasValue)
        {
            const string validationSql = @"
                SELECT COUNT(1)
                FROM Categories
                WHERE Id = @SubcategoryId AND ParentId = @CategoryId
            ";

            var isValid = await _dbConnection.ExecuteScalarAsync<bool>(
                validationSql,
                new { model.SubcategoryId, model.CategoryId }
            );

            if (!isValid)
            {
                var error = new Error("Subcategory does not belong to the specified category.", ErrorType.Validation);
                return Result.Failure<PlacesListResponseModel>(error);
            }

            whereConditions.Add("p.CategoryId = @SubcategoryId");
            parameters.Add("SubcategoryId", model.SubcategoryId);
        }
        else if (model.SubcategoryId.HasValue)
        {
            whereConditions.Add("p.CategoryId = @SubcategoryId");
            parameters.Add("SubcategoryId", model.SubcategoryId);
        }
        else if (model.CategoryId.HasValue)
        {
            whereConditions.Add(@"
                p.CategoryId IN (
                    SELECT Id FROM Categories WHERE ParentId = @CategoryId
                )");
            parameters.Add("CategoryId", model.CategoryId);
        }

        if (model.Tags?.Count > 0)
        {
            whereConditions.Add(@"
                EXISTS (
                    SELECT 1
                    FROM PlaceVibeAssignments pa
                    WHERE pa.PlaceId = p.Id AND pa.PlaceVibeId IN @Tags
                )");
            parameters.Add("Tags", model.Tags);
        }

        switch (model.Context)
        {
            case SearchContext.Global:
                whereConditions.Add("p.IsDeleted = 0");
                whereConditions.Add("p.IsApproved = 1");
                break;

            case SearchContext.UserPlaces:
                whereConditions.Add("p.UserId = @CurrentUserId");
                parameters.Add("CurrentUserId", request.CurrentUserId);

                if (model.Status == "Approved")
                {
                    whereConditions.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                }
                else if (model.Status == "Unapproved")
                {
                    whereConditions.Add("p.IsApproved = 0 AND p.IsDeleted = 0");
                }
                else if (model.Status == "Deleted")
                {
                    var cutoff = DateTime.UtcNow.AddMinutes(-5);
                    parameters.Add("Cutoff", cutoff);
                    whereConditions.Add("p.IsDeleted = 1 AND p.IsDeletedByAdmin = 0 AND p.DeletedOn >= @Cutoff");
                }
                break;

            case SearchContext.Admin:
                if (model.Status == "Approved")
                {
                    whereConditions.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                }
                else if (model.Status == "Unapproved")
                {
                    whereConditions.Add("p.IsApproved = 0 AND p.IsDeleted = 0");
                }
                else if (model.Status == "Deleted")
                {
                    var cutoff = DateTime.UtcNow.AddMinutes(-5);
                    parameters.Add("Cutoff", cutoff);
                    whereConditions.Add("p.IsDeleted = 1 AND p.DeletedOn >= @Cutoff");
                }
                break;
        }

        var whereClause = whereConditions.Count > 0
            ? "WHERE " + string.Join(" AND ", whereConditions)
            : string.Empty;

        var countSql = $"SELECT COUNT(*) FROM Places p {whereClause}";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, parameters);

        var offset = (request.Page - 1) * PlacesPerPageCount;

        var dataSql = $@"
            SELECT
                p.Id,
                p.Name,
                p.SlugifiedName,
                p.ThumbUrl AS ImageUrl,
                p.IsDeleted
            FROM Places p
            {whereClause}
            ORDER BY p.CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
        ";

        parameters.Add("Offset", offset);
        parameters.Add("PageSize", PlacesPerPageCount);

        var places = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(dataSql, parameters);

        var result = new PlacesListResponseModel
        {
            Places = places,
            Pagination = new PaginationResponseModel
            {
                PageNumber = request.Page,
                ItemsPerPage = PlacesPerPageCount,
                RecordsCount = totalCount,
            }
        };

        return Result.Success(result);
    }
}
