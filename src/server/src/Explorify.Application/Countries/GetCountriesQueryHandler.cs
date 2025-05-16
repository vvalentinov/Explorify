using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Explorify.Application.Countries;

public class GetCountriesQueryHandler
    : IQueryHandler<GetCountriesQuery, IEnumerable<CountryResponseModel>>
{
    private readonly IRepository _repository;
    private readonly IMemoryCache _memoryCache;

    public GetCountriesQueryHandler(
        IRepository repository,
        IMemoryCache memoryCache)
    {
        _repository = repository;
        _memoryCache = memoryCache;
    }

    public async Task<Result<IEnumerable<CountryResponseModel>>> Handle(
        GetCountriesQuery request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.NameFilter))
        {
            var error = new Error("The country name cannot be null or whitespace!", ErrorType.Validation);
            return Result.Failure<IEnumerable<CountryResponseModel>>(error);
        }

        const string cacheKey = "Countries";

        if (!_memoryCache.TryGetValue(cacheKey, out List<Country>? countries))
        {
            countries = await _repository
                .AllAsNoTracking<Country>()
                .ToListAsync(cancellationToken);

            _memoryCache.Set(
                cacheKey,
                countries,
                new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(5),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
        }

        var trimmedNameFilter = request.NameFilter.Trim();

        countries ??= new List<Country>();

        var filteredCountries = countries
            .Where(x => x.Name.Contains(trimmedNameFilter, StringComparison.OrdinalIgnoreCase))
            .Select(x => new CountryResponseModel
            {
                Id = x.Id,
                Name = x.Name
            });

        return Result.Success(filteredCountries);
    }
}
