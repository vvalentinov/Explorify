using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.FavPlace.Add;

public class AddFavPlaceCommandHandler
    : ICommandHandler<AddFavPlaceCommand>
{
    private readonly IRepository _repository;

    public AddFavPlaceCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        AddFavPlaceCommand request,
        CancellationToken cancellationToken)
    {
        var placeId = request.PlaceId;
        var currentUserId = request.CurrentUserId;

        var place = await _repository.GetByIdAsync<Domain.Entities.Place>(placeId);

        if (place is null)
        {
            var error = new Error("No place with id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (place.UserId == currentUserId)
        {
            var error = new Error("You cannot add your own place to favorite places collection!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var favPlaceExists = await _repository
            .AllAsNoTracking<FavoritePlace>()
            .AnyAsync(x =>
                x.PlaceId == place.Id &&
                x.UserId == currentUserId,
                cancellationToken);

        if (favPlaceExists)
        {
            var error = new Error("Place is already present in favorite place collection!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var favPlace = new FavoritePlace { PlaceId = place.Id, UserId = currentUserId };

        await _repository.AddAsync(favPlace);
        await _repository.SaveChangesAsync();

        return Result.Success("Successfully added place to favorite places collection!");
    }
}
