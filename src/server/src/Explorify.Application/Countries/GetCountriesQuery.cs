using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Countries;

public record GetCountriesQuery(string NameFilter)
    : IQuery<IEnumerable<CountryResponseModel>>;
