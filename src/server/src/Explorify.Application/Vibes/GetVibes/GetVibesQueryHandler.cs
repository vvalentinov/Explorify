using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Vibes.GetVibes;

public class GetVibesQueryHandler
    : IQueryHandler<GetVibesQuery, IEnumerable<VibeResponseModel>>
{
    private readonly IRepository _repository;

    public GetVibesQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<VibeResponseModel>>> Handle(
        GetVibesQuery request,
        CancellationToken cancellationToken)
    {
        var vibes = (IEnumerable<VibeResponseModel>)await _repository
            .AllAsNoTracking<PlaceVibe>()
            .Select(x => new VibeResponseModel
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync(cancellationToken);

        return Result.Success(vibes);
    }
}
