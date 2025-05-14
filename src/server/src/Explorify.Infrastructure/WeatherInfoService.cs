using System.Text.Json;
using Explorify.Application;
using Microsoft.Extensions.Options;
using Explorify.Infrastructure.Settings;

namespace Explorify.Infrastructure;

public class WeatherInfoService : IWeatherInfoService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly WeatherApiSettings _weatherApiSettings;

    public WeatherInfoService(
        IHttpClientFactory httpClientFactory,
        IOptions<WeatherApiSettings> options)
    {
        _httpClientFactory = httpClientFactory;
        _weatherApiSettings = options.Value;
    }

    public async Task<JsonElement> GetWeatherInfo(double lat, double lon)
    {
        var client = _httpClientFactory.CreateClient();

        var apiKey = _weatherApiSettings.Key;

        var url = $"https://api.weatherapi.com/v1/current.json?key={apiKey}&q={lat},{lon}";

        var response = await client.GetStringAsync(url);

        var jsonResponse = JsonSerializer.Deserialize<JsonElement>(response);

        return jsonResponse;
    }
}
