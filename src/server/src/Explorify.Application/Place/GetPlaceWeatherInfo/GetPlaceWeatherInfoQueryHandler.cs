using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Place.GetPlaceWeatherInfo;

public class GetPlaceWeatherInfoQueryHandler
    : IQueryHandler<GetPlaceWeatherInfoQuery, GetPlaceWeatherInfoQueryResponseModel>
{
    private readonly IDbConnection _dbConnection;

    private readonly IWeatherInfoService _weatherInfoService;

    public GetPlaceWeatherInfoQueryHandler(
        IDbConnection dbConnection,
        IWeatherInfoService weatherInfoService)
    {
        _dbConnection = dbConnection;

        _weatherInfoService = weatherInfoService;
    }

    public async Task<Result<GetPlaceWeatherInfoQueryResponseModel>> Handle(
        GetPlaceWeatherInfoQuery request,
        CancellationToken cancellationToken)
    {
        var sql = "SELECT Latitude, Longitude FROM Places WHERE Id = @PlaceId";

        var coordinates = await _dbConnection.QueryFirstOrDefaultAsync<PlaceCoordinates>(sql, new { request.PlaceId });

        if (coordinates is null)
        {
            var error = new Error("No coordinates were found for place!", ErrorType.Validation);
            return Result.Failure<GetPlaceWeatherInfoQueryResponseModel>(error);
        }

        var weatherData = await _weatherInfoService.GetWeatherInfo(
            coordinates.Latitude,
            coordinates.Longitude);

        var responseModel = new GetPlaceWeatherInfoQueryResponseModel
        {
            WeatherData = weatherData
        };

        return Result.Success(responseModel);
    }
}
