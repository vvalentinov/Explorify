using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.GetPlaceWeatherInfo;

public record GetPlaceWeatherInfoQuery(Guid PlaceId)
    : IQuery<GetPlaceWeatherInfoQueryResponseModel>;

