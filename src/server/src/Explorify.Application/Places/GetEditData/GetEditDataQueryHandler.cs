using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetEditData;

public class GetEditDataQueryHandler
    : IQueryHandler<GetEditDataQuery, GetEditDataResponseModel>
{
    private readonly IRepository _repository;

    public GetEditDataQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<GetEditDataResponseModel>> Handle(
        GetEditDataQuery request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .All<Place>()
            .Include(x => x.Country)
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x =>
                x.Id == request.PlaceId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error("No place with id found!", ErrorType.Validation);
            return Result.Failure<GetEditDataResponseModel>(error);
        }

        if (place.UserId != request.CurrentUserId)
        {
            var error = new Error("Only place owner can edit the place!", ErrorType.Validation);
            return Result.Failure<GetEditDataResponseModel>(error);
        }

        var placeUserReview = await _repository
            .AllAsNoTracking<Review>()
            .FirstAsync(x =>
                x.UserId == request.CurrentUserId &&
                x.PlaceId == request.PlaceId,
                cancellationToken);

        var responseModel = new GetEditDataResponseModel
        {
            Name = place.Name,
            Description = place.Description,
            Rating = placeUserReview.Rating,
            ReviewContent = placeUserReview.Content,
            CategoryId = place.CategoryId,
            CountryId = place.CountryId,
            CountryName = place.Country.Name,
            Address = place.Address ?? string.Empty,
            Images = [.. place.Photos.Select(photo => new ImageResponseModel { Id = photo.Id, Url = photo.Url })],
        };

        return Result.Success(responseModel);
    }
}
