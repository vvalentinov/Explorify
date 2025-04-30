using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetPlace;

public class GetPlaceQueryHandler
    : IQueryHandler<GetPlaceQuery, PlaceDetailsResponseModel>
{
    private readonly IRepository _repository;

    public GetPlaceQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlaceDetailsResponseModel>> Handle(
        GetPlaceQuery request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .AllAsNoTracking<Place>()
            .Include(x => x.Photos)
            .Select(x => new PlaceDetailsResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImagesUrls = x.Photos.OrderByDescending(x => x.CreatedOn).Select(c => c.Url)
            }).FirstOrDefaultAsync(x => x.Id == request.PlaceId, cancellationToken);

        if (place == null)
        {
            var error = new Error("No place with given id!", ErrorType.Validation);
            return Result.Failure<PlaceDetailsResponseModel>(error);
        }

        return Result.Success(place);
    }
}
