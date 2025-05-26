using System.Data;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

using Microsoft.Extensions.Caching.Memory;

namespace Explorify.Application.Country;

public class GetCountriesQueryHandler
    : IQueryHandler<GetCountriesQuery, IEnumerable<CountryResponseModel>>
{
    private readonly IMemoryCache _memoryCache;
    private readonly IDbConnection _dbConnection;

    public GetCountriesQueryHandler(
        IMemoryCache memoryCache,
        IDbConnection dbConnection)
    {
        _memoryCache = memoryCache;
        _dbConnection = dbConnection;
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

        if (!_memoryCache.TryGetValue(cacheKey, out List<CountryResponseModel>? countries))
        {
            const string sql = @"
                SELECT
                    Id,
                    Name
                FROM Countries";

            countries = (await _dbConnection.QueryAsync<CountryResponseModel>(sql)).ToList();

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

        var filteredCountries = countries?
           .Where(x => x.Name.Contains(trimmedNameFilter, StringComparison.OrdinalIgnoreCase));

        return Result.Success(filteredCountries!);
    }
}
