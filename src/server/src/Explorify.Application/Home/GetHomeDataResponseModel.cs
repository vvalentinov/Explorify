namespace Explorify.Application.Home;

public class GetHomeDataResponseModel
{
    public IEnumerable<HomePlaceDisplayResponseModel> RecentPlaces { get; set; } = [];

    public IEnumerable<HomePlaceDisplayResponseModel> HighestRatedPlaces { get; set; } = [];
}
