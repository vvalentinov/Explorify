using System.Text.Json;

using Explorify.Application.Place;
using Explorify.Infrastructure.Settings;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace Explorify.Infrastructure.Services;

public class GeocodingService : IGeocodingService
{
    private readonly ILogger<GeocodingService> _logger;

    private readonly GeocodingSettings _geocoding;

    private readonly IHttpClientFactory _httpClientFactory;

    public GeocodingService(
        IHttpClientFactory httpClientFactory,
        IOptions<GeocodingSettings> options,
        ILogger<GeocodingService> logger)
    {
        _logger = logger;

        _geocoding = options.Value;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<PlaceCoordinates?> GetCoordinatesAsync(string address)
    {
        if (string.IsNullOrWhiteSpace(address))
        {
            _logger.LogWarning("Attempted to geocode an empty or null address.");
            return null;
        }

        try
        {
            var client = _httpClientFactory.CreateClient();

            var apiKey = _geocoding.ApiKey;

            var url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={apiKey}";

            var response = await client.GetAsync(url);

            if (response.IsSuccessStatusCode is false)
            {
                _logger.LogWarning("Geocoding API returned non-success status: {StatusCode}", response.StatusCode);
                return null;
            }

            using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);

            var root = doc.RootElement;

            if (root.GetProperty("status").GetString() != "OK")
            {
                _logger.LogWarning("Geocoding API returned status: {Status}", root.GetProperty("status").GetString());
                return null;
            }

            var location = root
                .GetProperty("results")[0]
                .GetProperty("geometry")
                .GetProperty("location");

            return new PlaceCoordinates
            {
                Latitude = location.GetProperty("lat").GetDouble(),
                Longitude = location.GetProperty("lng").GetDouble()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while calling Geocoding API.");
            return null;
        }
    }
}
