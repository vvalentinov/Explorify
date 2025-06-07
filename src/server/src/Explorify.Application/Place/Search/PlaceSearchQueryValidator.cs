using System.Data;

using Explorify.Application.Abstractions.Models;

using Dapper;

namespace Explorify.Application.Place.Search;

public class PlaceSearchQueryValidator
    : IPlaceSearchQueryValidator
{
    private readonly IDbConnection _dbConnection;

    public PlaceSearchQueryValidator(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result> Validate(
        SearchPlaceRequestDto dto,
        Guid currentUserId,
        bool isCurrUserAdmin,
        bool isUserAuthenticated)
    {
        var authResult = IsAuthorizedToPerformSearch(
            isCurrUserAdmin,
            isUserAuthenticated,
            dto.Context);

        if (authResult.IsFailure)
        {
            return authResult;
        }

        if (dto.CategoryId.HasValue && dto.SubcategoryId.HasValue)
        {
            const string validationSql = @"
                SELECT
                    COUNT(1)
                FROM Categories
                WHERE Id = @SubcategoryId AND ParentId = @CategoryId
            ";

            var paramaters = new { dto.SubcategoryId, dto.CategoryId };
            var isValid = await _dbConnection.ExecuteScalarAsync<bool>(validationSql, paramaters);

            if (!isValid)
            {
                var error = new Error("Subcategory does not belong to the specified category.", ErrorType.Validation);
                return Result.Failure(error);
            }
        }

        if (dto.Context == SearchContext.UserFollowing)
        {
            if (!dto.UserFollowingId.HasValue)
            {
                var error = new Error("UserFollowingId is required for UserFollowing context.", ErrorType.Validation);
                return Result.Failure(error);
            }

            const string followCheckSql = @"
                       SELECT COUNT(1)
                       FROM UserFollows
                       WHERE FollowerId = @CurrentUserId AND FolloweeId = @UserFollowingId AND IsDeleted = 0;
                   ";

            var isFollowing = await _dbConnection.ExecuteScalarAsync<bool>(
                followCheckSql,
                new
                {
                    CurrentUserId = currentUserId,
                    dto.UserFollowingId
                }
            );

            if (!isFollowing)
            {
                var error = new Error("You are not following the specified user.", ErrorType.Validation);
                return Result.Failure(error);
            }
        }

        return Result.Success();
    }

    private static Result IsAuthorizedToPerformSearch(
        bool isCurrUserAdmin,
        bool isUserAuthenticated,
        SearchContext context)
    {
        if ((!isCurrUserAdmin && context == SearchContext.Admin) ||
            (!isUserAuthenticated && context == SearchContext.UserPlaces) ||
            (!isUserAuthenticated && context == SearchContext.FavPlace))
        {
            var error = new Error("You are not authorized to perform this search.", ErrorType.Validation);
            return Result.Failure(error);
        }

        return Result.Success();
    }
}
