using Dapper;

namespace Explorify.Application.Place.Search;

public class PlaceSearchQueryBuilder
    : IPlaceSearchQueryBuilder
{
    private List<string> _filters = new();
    private DynamicParameters _parameters = new();

    public PlaceSearchQueryBuilder()
    {
        Reset();
    }

    public DynamicParameters Parameters => _parameters;

    public IReadOnlyList<string> Filters => _filters;

    public void Reset()
    {
        _filters = new List<string>();
        _parameters = new DynamicParameters();
    }

    public void BuildNameFilter(string? name)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            _filters.Add("p.Name LIKE @Name");
            _parameters.Add("Name", $"%{name}%");
        }
    }

    public void BuildCountryFilter(int? countryId)
    {
        if (countryId.HasValue)
        {
            _filters.Add("p.CountryId = @CountryId");
            _parameters.Add("CountryId", countryId);
        }
    }

    public void BuildCategoryFilter(int? categoryId, int? subcategoryId)
    {
        if (subcategoryId.HasValue)
        {
            _filters.Add("p.CategoryId = @SubcategoryId");
            _parameters.Add("SubcategoryId", subcategoryId);
        }
        else if (categoryId.HasValue)
        {
            _filters.Add("p.CategoryId IN (SELECT Id FROM Categories WHERE ParentId = @CategoryId)");
            _parameters.Add("CategoryId", categoryId);
        }
    }

    public void BuildTagsFilter(List<int>? tags)
    {
        if (tags?.Count > 0)
        {
            _filters.Add(@"
                EXISTS (
                    SELECT 1
                    FROM PlaceVibeAssignments pa
                    WHERE pa.PlaceId = p.Id AND pa.PlaceVibeId IN @Tags
                )");

            _parameters.Add("Tags", tags);
        }
    }

    public void BuildContextFilter(
        SearchContext searchContext,
        EntityStatus entityStatus,
        Guid? currentUserId,
        Guid? userFollowingId)
    {
        switch (searchContext)
        {
            case SearchContext.Global:
                _filters.Add("p.IsDeleted = 0");
                _filters.Add("p.IsApproved = 1");
                break;

            case SearchContext.UserPlaces:
                _filters.Add("p.UserId = @CurrentUserId");
                _parameters.Add("CurrentUserId", currentUserId);

                if (entityStatus == EntityStatus.Approved)
                {
                    _filters.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                }
                else if (entityStatus == EntityStatus.Unapproved)
                {
                    _filters.Add("p.IsApproved = 0 AND p.IsDeleted = 0");
                }
                else if (entityStatus == EntityStatus.Deleted)
                {
                    var cutoff = DateTime.UtcNow.AddMinutes(-5);

                    _parameters.Add("Cutoff", cutoff);

                    _filters.Add(@"
                        p.IsDeleted = 1 AND
                        p.IsDeletedByAdmin = 0 AND
                        p.DeletedOn >= @Cutoff AND
                        p.IsCleaned = 0");
                }
                break;

            case SearchContext.Admin:
                if (entityStatus == EntityStatus.Approved)
                {
                    _filters.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                }
                else if (entityStatus == EntityStatus.Unapproved)
                {
                    _filters.Add("p.IsApproved = 0 AND p.IsDeleted = 0");
                }
                else if (entityStatus == EntityStatus.Deleted)
                {
                    var cutoff = DateTime.UtcNow.AddMinutes(-5);
                    _parameters.Add("Cutoff", cutoff);
                    _filters.Add("p.IsDeleted = 1 AND p.DeletedOn >= @Cutoff");
                }
                break;

            case SearchContext.UserFollowing:
                _filters.Add("p.UserId = @UserFollowingId");
                _filters.Add("p.IsApproved = 1");
                _filters.Add("p.IsDeleted = 0");
                _parameters.Add("UserFollowingId", userFollowingId);
                break;

            case SearchContext.FavPlace:
                _filters.Add("p.Id IN (SELECT fp.PlaceId FROM FavoritePlaces AS fp WHERE fp.UserId = @CurrentUserId)");
                _filters.Add("p.IsApproved = 1 AND p.IsDeleted = 0");
                _parameters.Add("CurrentUserId", currentUserId);
                break;
        }
    }

    public string BuildSearchQuery(int offSet, int placesPerPage, Guid userId)
    {
        var whereClause = _filters.Count > 0
            ? "WHERE " + string.Join(" AND ", _filters)
            : string.Empty;

        var dataSql = $@"
            SELECT
                p.Id,
                p.Name,
                p.SlugifiedName,
                p.ThumbUrl AS ImageUrl,
                p.IsDeleted,
                p.CreatedOn,
                p.UserId,
                COALESCE(AVG(CAST(r.Rating AS FLOAT)), 0) AS AverageRating,
                CASE WHEN fp.PlaceId IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS IsFavorite
            FROM Places p
            LEFT JOIN Reviews r ON p.Id = r.PlaceId AND r.IsApproved = 1
            LEFT JOIN FavoritePlaces fp ON fp.PlaceId = p.Id AND fp.UserId = @UserId
            {whereClause}
            GROUP BY
                p.Id,
                p.Name,
                p.SlugifiedName,
                p.ThumbUrl,
                p.IsDeleted,
                p.CreatedOn,
                p.UserId,
                fp.PlaceId
            ORDER BY p.CreatedOn DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
        ";

        _parameters.Add("Offset", offSet);
        _parameters.Add("PageSize", placesPerPage);
        _parameters.Add("UserId", userId);

        return dataSql;
    }

    public string BuildCountQuery()
    {
        var whereClause = _filters.Count > 0
            ? "WHERE " + string.Join(" AND ", _filters)
            : string.Empty;

        return $"SELECT COUNT(*) FROM Places p {whereClause}";
    }
}
