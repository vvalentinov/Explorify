using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Countries;

public class GetCountriesQueryHandler
    : IQueryHandler<GetCountriesQuery, IEnumerable<CountryResponseModel>>
{
    private readonly IRepository _repository;

    public GetCountriesQueryHandler(IRepository repository)
    {
        _repository = repository;
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

        var countries = (IEnumerable<CountryResponseModel>)await _repository
            .AllAsNoTracking<Country>()
            .Where(x => EF.Functions.Like(x.Name, $"%{request.NameFilter.Trim()}%"))
            .Select(x => new CountryResponseModel
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync(cancellationToken);

        return Result.Success(countries);
    }
}
