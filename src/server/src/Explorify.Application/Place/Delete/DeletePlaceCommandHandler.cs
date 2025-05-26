using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Place.Delete;

public class DeletePlaceCommandHandler
    : ICommandHandler<DeletePlaceCommand>
{
    private readonly IRepository _repository;
    private readonly INotificationService _notificationService;

    public DeletePlaceCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        DeletePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var placeId = request.Model.PlaceId;
        var reason = request.Model.Reason;
        var currUserId = request.CurrentUserId;
        var isCurrUserAdmin = request.IsCurrUserAdmin;

        var query = _repository
            .All<Domain.Entities.Place>()
            .Where(x => x.Id == placeId);

        if (!isCurrUserAdmin)
        {
            query = query.Where(x => x.UserId == currUserId);
        }

        var place = await query.Include(x => x.Reviews).FirstOrDefaultAsync(cancellationToken);

        // the place was not found
        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        // the current user is not admin
        // the place does not belong to the current user
        if (!request.IsCurrUserAdmin &&
           place.UserId != request.CurrentUserId)
        {
            var error = new Error(DeleteError, ErrorType.Validation);
            return Result.Failure(error);
        }

        // current user is admin
        // the place to delete is not his
        // there must be a reason provided
        if (isCurrUserAdmin && place.UserId != currUserId && string.IsNullOrWhiteSpace(reason))
        {
            var error = new Error("A reason for the delete must be provided!", ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.SoftDelete(place);

        foreach (var review in place.Reviews)
        {
            _repository.SoftDelete(review);
        }

        // current user is admin
        // the place to delete is not his
        if (isCurrUserAdmin && place.UserId != currUserId)
        {
            var notification = new Domain.Entities.Notification
            {
                ReceiverId = place.UserId,
                SenderId = currUserId,
                Content = $"Your place '{place.Name}' was removed by an admin. Reason: {reason}"
            };

            await _repository.AddAsync(notification);
        }

        await _repository.SaveChangesAsync();

        // current user is admin
        // the place to delete is not his
        if (isCurrUserAdmin && place.UserId != currUserId)
        {
            await _notificationService.NotifyAsync(
                "An admin deleted your place!",
                place.UserId);
        }

        return Result.Success(PlaceDeleteSuccess);
    }
}
