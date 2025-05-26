using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Place.Edit.GetEditData;

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
            .All<Domain.Entities.Place>()
            .Include(x => x.Country)
            .Include(x => x.Photos)
            .Include(x => x.PlaceVibeAssignments)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x =>
                x.Id == request.PlaceId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure<GetEditDataResponseModel>(error);
        }

        if (place.UserId != request.CurrentUserId)
        {
            var error = new Error(EditError, ErrorType.Validation);
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
            PlaceId = place.Id,
            Name = place.Name,
            Description = place.Description,
            Rating = placeUserReview.Rating,
            ReviewContent = placeUserReview.Content,
            CategoryId = place.CategoryId,
            CountryId = place.CountryId,
            CountryName = place.Country.Name,
            Address = place.Address ?? string.Empty,
            Latitude = place.Latitude ?? 0,
            Longitude = place.Longitude ?? 0,
            Images = [.. place.Photos.Where(x => !x.IsDeleted).Select(photo =>
                new ImageResponseModel { Id = photo.Id, Url = photo.Url })],
            TagsIds = place.PlaceVibeAssignments.Select(x => x.PlaceVibeId).ToList(),
        };

        return Result.Success(responseModel);
    }
}
