using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.FavPlace.Remove;

public class RemoveFavPlaceCommandHandler
    : ICommandHandler<RemoveFavPlaceCommand>
{
    private readonly IRepository _repository;

    public RemoveFavPlaceCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        RemoveFavPlaceCommand request,
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

        var favPlace = await _repository
            .AllAsNoTracking<FavoritePlace>()
            .FirstOrDefaultAsync(x =>
                x.PlaceId == place.Id &&
                x.UserId == currentUserId,
                cancellationToken);

        if (favPlace is null)
        {
            var error = new Error("Place is not present in favorite place collection!", ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.HardDelete(favPlace);
        await _repository.SaveChangesAsync();

        return Result.Success("Successfully removed place from favorite place collection!");
    }
}
