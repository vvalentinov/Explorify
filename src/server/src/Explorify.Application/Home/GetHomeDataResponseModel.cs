using Explorify.Application.Place;

namespace Explorify.Application.Home;

public class GetHomeDataResponseModel
{
    public IEnumerable<PlaceDisplayResponseModel> RecentPlaces { get; set; } = [];

    public IEnumerable<PlaceDisplayResponseModel> HighestRatedPlaces { get; set; } = [];
}
