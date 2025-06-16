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

    private readonly IPlaceSearchQueryBuilder _placeSearchQueryBuilder;
    private readonly IPlaceSearchQueryValidator _placeSearchQueryValidator;

    public SearchPlaceQueryHandler(
        IDbConnection dbConnection,
        IPlaceSearchQueryBuilder placeSearchQueryBuilder,
        IPlaceSearchQueryValidator placeSearchQueryValidator)
    {
        _dbConnection = dbConnection;

        _placeSearchQueryBuilder = placeSearchQueryBuilder;
        _placeSearchQueryValidator = placeSearchQueryValidator;
    }

    public async Task<Result<PlacesListResponseModel>> Handle(
        SearchPlaceQuery request,
        CancellationToken cancellationToken)
    {
        _placeSearchQueryBuilder.Reset();
        _placeSearchQueryBuilder.SetIsCurrentUserAdmin(request.IsCurrentUserAdmin);

        var model = request.Model;

        var validationResult = await _placeSearchQueryValidator.Validate(
            model,
            request.CurrentUserId,
            request.IsCurrentUserAdmin,
            request.IsUserAuthenticated);

        if (validationResult.IsFailure)
        {
            return Result.Failure<PlacesListResponseModel>(validationResult.Error);
        }

        _placeSearchQueryBuilder.BuildNameFilter(model.Name);
        _placeSearchQueryBuilder.BuildCountryFilter(model.CountryId);
        _placeSearchQueryBuilder.BuildCategoryFilter(model.CategoryId, model.SubcategoryId);
        _placeSearchQueryBuilder.BuildTagsFilter(model.Tags);

        _placeSearchQueryBuilder.BuildContextFilter(
            model.Context,
            model.Status ?? EntityStatus.Approved,
            request.CurrentUserId,
            model.UserFollowingId);

        var countSql = _placeSearchQueryBuilder.BuildCountQuery();
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, _placeSearchQueryBuilder.Parameters);

        var offset = (request.Page - 1) * PlacesPerPageCount;
        var dataSql = _placeSearchQueryBuilder.BuildSearchQuery(offset, PlacesPerPageCount, request.CurrentUserId);

        var places = await _dbConnection.QueryAsync<PlaceDisplayResponseModel>(dataSql, _placeSearchQueryBuilder.Parameters);

        var responseModel = new PlacesListResponseModel
        {
            Places = places,
            Pagination = new PaginationResponseModel
            {
                RecordsCount = totalCount,
                PageNumber = request.Page,
                ItemsPerPage = PlacesPerPageCount,
            }
        };

        return Result.Success(responseModel);
    }
}