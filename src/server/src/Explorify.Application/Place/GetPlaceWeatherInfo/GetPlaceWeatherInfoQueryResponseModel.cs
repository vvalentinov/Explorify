using System.Text.Json;

namespace Explorify.Application.Place.GetPlaceWeatherInfo;

public class GetPlaceWeatherInfoQueryResponseModel
{
    public JsonElement WeatherData { get; set; }
}
