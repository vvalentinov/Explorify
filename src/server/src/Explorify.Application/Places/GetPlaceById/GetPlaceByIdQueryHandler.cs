using Explorify.Domain.Entities;
using Explorify.Application.Places.GetPlace;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetPlaceById;

public class GetPlaceByIdQueryHandler
    : IQueryHandler<GetPlaceByIdQuery, PlaceDetailsResponseModel>
{
    private readonly IRepository _repository;

    public GetPlaceByIdQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PlaceDetailsResponseModel>> Handle(
        GetPlaceByIdQuery request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .AllAsNoTracking<Place>()
            .Include(x => x.Photos)
            .Include(x => x.Reviews)
            .Select(x => new PlaceDetailsResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ImagesUrls = x.Photos.OrderByDescending(x => x.CreatedOn).Select(c => c.Url),
                UserReviewRating = x.Reviews.Where(r => r.UserId == x.UserId).Select(x => x.Rating).First(),
                UserReviewContent = x.Reviews.Where(r => r.UserId == x.UserId).Select(x => x.Content).First(),
            }).FirstOrDefaultAsync(x => x.Id == request.PlaceId, cancellationToken);

        if (place == null)
        {
            var error = new Error("No place with given id!", ErrorType.Validation);
            return Result.Failure<PlaceDetailsResponseModel>(error);
        }

        return Result.Success(place);
    }
}
