using Explorify.Application.Places;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IGeocodingService
{
    Task<PlaceCoordinates?> GetCoordinatesAsync(string address);
}
