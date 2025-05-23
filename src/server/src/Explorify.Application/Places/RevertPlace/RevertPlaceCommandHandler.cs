using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.RevertPlace;

public class RevertPlaceCommandHandler
    : ICommandHandler<RevertPlaceCommand>
{
    private readonly IRepository _repository;

    public RevertPlaceCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        RevertPlaceCommand request,
        CancellationToken cancellationToken)
    {
        var placeId = request.PlaceId;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrUserAdmin;

        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var place = await _repository
            .All<Place>(withDeleted: true)
            .Include(x => x.Reviews)
            .Where(x =>
                x.IsDeleted &&
                !x.IsCleaned &&
                x.DeletedOn >= cutoff &&
                (x.UserId == currUserId || isCurrUserAdmin))
            .FirstOrDefaultAsync(x =>
                x.Id == placeId,
                cancellationToken);

        if (place == null)
        {
            var error = new Error("No place found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.IsApproved = false;
        place.IsDeleted = false;
        place.DeletedOn = null;

        foreach (var review in place.Reviews)
        {
            review.IsDeleted = false;
            review.DeletedOn = null;
        }

        _repository.Update(place);

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully reverted deleted place!");
    }
}
