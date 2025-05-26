using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Country;

public record GetCountriesQuery(string NameFilter)
    : IQuery<IEnumerable<CountryResponseModel>>;
