using System.Data;
using System.Data.Common;
using Azure.Core;
using Dapper;
using Explorify.Application.Abstractions.Models;
using MediatR;

namespace Explorify.Application.Place.Search;

public class PlaceSearchQueryBuilder
{
    private readonly List<string> _whereConditions = new();
    private readonly DynamicParameters _parameters = new();

    public void AddNameFilter(string? name)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            _whereConditions.Add("p.Name LIKE @Name");
            _parameters.Add("Name", $"%{name}%");
        }
    }

    public void AddCountryFilter(int? countryId)
    {
        if (countryId.HasValue)
        {
            _whereConditions.Add("p.CountryId = @CountryId");
            _parameters.Add("CountryId", countryId);
        }
    }

    public void AddCategoryFilter(
        int? categoryId,
        int? subcategoryId,
        IDbConnection dbConnection)
    {
        if (categoryId.HasValue && subcategoryId.HasValue)
        {
            const string sql = @"SELECT COUNT(1) FROM Categories WHERE Id = @SubcategoryId AND ParentId = @CategoryId";
            var isValid = dbConnection.ExecuteScalar<bool>(sql, new { SubcategoryId = subcategoryId, CategoryId = categoryId });

            if (!isValid)
                throw new Exception("Invalid category hierarchy");

            _whereConditions.Add("p.CategoryId = @SubcategoryId");
            _parameters.Add("SubcategoryId", subcategoryId);
        }
        else if (subcategoryId.HasValue)
        {
            _whereConditions.Add("p.CategoryId = @SubcategoryId");
            _parameters.Add("SubcategoryId", subcategoryId);
        }
        else if (categoryId.HasValue)
        {
            _whereConditions.Add(@"p.CategoryId IN (SELECT Id FROM Categories WHERE ParentId = @CategoryId)");
            _parameters.Add("CategoryId", categoryId);
        }
    }

    public void AddTagFilter(List<int>? tags)
    {
        if (tags?.Count > 0)
        {
            _whereConditions.Add(@"
                EXISTS (
                    SELECT 1
                    FROM PlaceVibeAssignments pa
                    WHERE pa.PlaceId = p.Id AND pa.PlaceVibeId IN @Tags
                )");
            _parameters.Add("Tags", tags);
        }
    }

    public void AddContextFilter(
        SearchContext context,
        SearchPlaceRequestDto model,
        Guid currentUserId,
        IDbConnection dbConnection)
    {
        switch (context)
        {
            case SearchContext.Global:
                _whereConditions.Add("p.IsDeleted = 0");
                _whereConditions.Add("p.IsApproved = 1");
                break;

            case SearchContext.FavPlace:
                _whereConditions.Add("p.Id IN (SELECT PlaceId FROM FavoritePlaces WHERE UserId = @CurrentUserId)");
                _whereConditions.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                _parameters.Add("CurrentUserId", currentUserId);
                break;

            case SearchContext.UserPlaces:
                _whereConditions.Add("p.UserId = @CurrentUserId");
                _parameters.Add("CurrentUserId", currentUserId);

                if (model.Status?.ToLower() == "approved")
                {
                    _whereConditions.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                }
                else if (model.Status?.ToLower() == "unapproved")
                {
                    _whereConditions.Add("p.IsApproved = 0 AND p.IsDeleted = 0");
                }
                else if (model.Status?.ToLower() == "deleted")
                {
                    var cutoff = DateTime.UtcNow.AddMinutes(-5);
                    _parameters.Add("Cutoff", cutoff);
                    _whereConditions.Add(@"
                        p.IsDeleted = 1 AND
                        p.IsDeletedByAdmin = 0 AND
                        p.DeletedOn >= @Cutoff AND
                        p.IsCleaned = 0");
                }
                break;

            case SearchContext.Admin:
                if (model.Status?.ToLower() == "approved")
                {
                    _whereConditions.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                }
                else if (model.Status?.ToLower() == "unapproved")
                {
                    _whereConditions.Add("p.IsApproved = 0 AND p.IsDeleted = 0");
                }
                else if (model.Status?.ToLower() == "deleted")
                {
                    var cutoff = DateTime.UtcNow.AddMinutes(-5);
                    _parameters.Add("Cutoff", cutoff);
                    _whereConditions.Add("p.IsDeleted = 1 AND p.DeletedOn >= @Cutoff");
                }
                break;

                //case SearchContext.UserFollowing:

                //    if (!model.UserFollowingId.HasValue)
                //    {
                //        var error = new Error("UserFollowingId is required for UserFollowing context.", ErrorType.Validation);
                //        return Result.Failure<PlacesListResponseModel>(error);
                //    }

                //    const string followCheckSql = @"
                //        SELECT COUNT(1)
                //        FROM UserFollows
                //        WHERE FollowerId = @CurrentUserId AND FolloweeId = @UserFollowingId AND IsDeleted = 0;
                //    ";

                //    var isFollowing = await _dbConnection.ExecuteScalarAsync<bool>(
                //    followCheckSql,
                //        new
                //        {
                //            request.CurrentUserId,
                //            model.UserFollowingId
                //        }
                //    );

                //    if (!isFollowing)
                //    {
                //        var error = new Error("You are not following the specified user.", ErrorType.Validation);
                //        return Result.Failure<PlacesListResponseModel>(error);
                //    }

                //    whereConditions.Add("p.UserId = @UserFollowingId");
                //    whereConditions.Add("p.IsApproved = 1");
                //    whereConditions.Add("p.IsDeleted = 0");
                //    parameters.Add("UserFollowingId", model.UserFollowingId);
                //    break;

                //         public (string WhereClause, DynamicParameters Parameters) Build()
                //{
                //    var whereClause = _whereConditions.Count > 0
                //        ? "WHERE " + string.Join(" AND ", _whereConditions)
                //        : string.Empty;

                //    return (whereClause, _parameters);
                //}
        }
    }
}
