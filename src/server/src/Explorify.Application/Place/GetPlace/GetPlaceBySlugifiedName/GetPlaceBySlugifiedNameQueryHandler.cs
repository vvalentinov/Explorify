using System.Data;

using Explorify.Application.Vibes;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Application.Place.GetPlace.GetPlaceSqlGenerator;

using Dapper;

namespace Explorify.Application.Place.GetPlace.GetPlaceBySlugifiedName;

public class GetPlaceBySlugifiedNameQueryHandler
    : IQueryHandler<GetPlaceBySlugifiedNameQuery, PlaceDetailsResponseModel>
{
    private readonly IDbConnection _dbConnection;

    private readonly IWeatherInfoService _weatherInfoService;

    public GetPlaceBySlugifiedNameQueryHandler(
        IDbConnection dbConnection,
        IWeatherInfoService weatherInfoService)
    {
        _dbConnection = dbConnection;

        _weatherInfoService = weatherInfoService;
    }

    public async Task<Result<PlaceDetailsResponseModel>> Handle(
        GetPlaceBySlugifiedNameQuery request,
        CancellationToken cancellationToken)
    {
        var sql = GetPlaceBySlugifiedNameForUser();

        using var multi = await _dbConnection.QueryMultipleAsync(sql, new
        {
            request.SlugifiedName,
            UserId = request.CurrentUserId
        });

        var place = await multi.ReadFirstOrDefaultAsync<PlaceDetailsResponseModel>();

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure<PlaceDetailsResponseModel>(error);
        }

        place.ImagesUrls = [.. await multi.ReadAsync<string>()];
        place.Tags = [.. await multi.ReadAsync<VibeResponseModel>()];

        place.WeatherData = await _weatherInfoService.GetWeatherInfo(place.Latitude, place.Longitude);

        return Result.Success(place);
    }
}
