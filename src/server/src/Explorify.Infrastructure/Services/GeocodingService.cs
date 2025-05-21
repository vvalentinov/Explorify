using System.Text.Json;

using Explorify.Application.Places;
using Explorify.Infrastructure.Settings;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.Extensions.Options;

namespace Explorify.Infrastructure.Services;

public class GeocodingService : IGeocodingService
{
    private readonly GeocodingSettings _geocoding;
    private readonly IHttpClientFactory _httpClientFactory;

    public GeocodingService(
        IHttpClientFactory httpClientFactory,
        IOptions<GeocodingSettings> options)
    {
        _geocoding = options.Value;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<PlaceCoordinates?> GetCoordinatesAsync(string address)
    {
        var client = _httpClientFactory.CreateClient();

        var apiKey = _geocoding.ApiKey;

        var url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={apiKey}";

        var response = await client.GetStringAsync(url);

        var jsonResponse = JsonSerializer.Deserialize<JsonElement>(response);

        if (jsonResponse.GetProperty("status").GetString() == "OK")
        {
            var location = jsonResponse
                .GetProperty("results")[0]
                .GetProperty("geometry")
                .GetProperty("location");

            double latitude = location.GetProperty("lat").GetDouble();
            double longitude = location.GetProperty("lng").GetDouble();

            return new PlaceCoordinates
            {
                Latitude = latitude,
                Longitude = longitude,
            };
        }

        return null;
    }
}
