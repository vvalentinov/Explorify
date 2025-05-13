namespace Explorify.Application;

public interface IGeocodingService
{
    Task<PlaceCoordinates?> GetCoordinatesAsync(string address);
}
