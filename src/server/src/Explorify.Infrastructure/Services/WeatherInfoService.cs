using System.Text.Json;

using Explorify.Infrastructure.Settings;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace Explorify.Infrastructure.Services;

public class WeatherInfoService : IWeatherInfoService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<WeatherInfoService> _logger;
    private readonly WeatherApiSettings _weatherApiSettings;

    public WeatherInfoService(
        IHttpClientFactory httpClientFactory,
        IOptions<WeatherApiSettings> options,
        ILogger<WeatherInfoService> logger)
    {
        _weatherApiSettings = options.Value;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<JsonElement> GetWeatherInfo(double lat, double lon)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();

            var apiKey = _weatherApiSettings.Key;

            var url = $"https://api.weatherapi.com/v1/current.json?key={apiKey}&q={lat},{lon}";

            var response = await client.GetStringAsync(url);

            var jsonResponse = JsonSerializer.Deserialize<JsonElement>(response);

            return jsonResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to fetch weather info for lat={Lat}, lon={Lon}",
                lat,
                lon);

            return JsonDocument.Parse("{}").RootElement;
        }
    }
}
