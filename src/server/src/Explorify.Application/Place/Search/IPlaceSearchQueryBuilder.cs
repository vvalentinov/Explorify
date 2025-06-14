using Dapper;

namespace Explorify.Application.Place.Search;

public interface IPlaceSearchQueryBuilder
{
    void Reset();

    void BuildNameFilter(string? name);

    void BuildCountryFilter(int? countryId);

    void BuildCategoryFilter(int? categoryId, int? subcategoryId);

    void BuildTagsFilter(List<int>? tags);

    void BuildContextFilter(
        SearchContext searchContext,
        EntityStatus entityStatus,
        Guid? currentUserId,
        Guid? userFollowingId);

    string BuildSearchQuery(int offSet, int placesPerPage, Guid userId);

    string BuildCountQuery();

    DynamicParameters Parameters { get; }
}