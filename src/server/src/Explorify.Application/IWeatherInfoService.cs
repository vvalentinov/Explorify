using System.Text.Json;

namespace Explorify.Application;

public interface IWeatherInfoService
{
    Task<JsonElement> GetWeatherInfo(double lat, double lon);
}
