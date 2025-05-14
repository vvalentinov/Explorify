using System.Text.Json;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IWeatherInfoService
{
    Task<JsonElement> GetWeatherInfo(double lat, double lon);
}
