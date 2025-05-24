using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Delete;

public class DeletePlaceCommandHandler
    : ICommandHandler<DeletePlaceCommand>
{
    private readonly IRepository _repository;

    public DeletePlaceCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        DeletePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var placeId = request.PlaceId;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrUserAdmin;

        var place = await _repository
            .All<Place>()
            .Include(p => p.Reviews)
            .Where(p => p.Id == placeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (!request.IsCurrUserAdmin &&
            place.UserId != request.CurrentUserId)
        {
            var error = new Error(DeleteError, ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.SoftDelete(place);

        foreach (var review in place.Reviews)
        {
            _repository.SoftDelete(review);
        }

        await _repository.SaveChangesAsync();

        return Result.Success(PlaceDeleteSuccess);
    }
}
