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
        var place = await LoadPlaceAsync(request, cancellationToken);

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (CanDeletePlace(request, place) is false)
        {
            var error = new Error(DeleteError, ErrorType.Validation);
            return Result.Failure(error);
        }

        if (IsAdminDeletingSomeoneElse(request, place) && string.IsNullOrWhiteSpace(request.Model.Reason))
        {
            var error = new Error("A reason for the delete must be provided!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.MarkAsDeletedWithReviews(request.IsCurrUserAdmin);

        if (IsAdminDeletingSomeoneElse(request, place))
        {
            await NotifyUserOfAdminDeletionAsync(place, request);
        }

        await _repository.SaveChangesAsync();

        return Result.Success(PlaceDeleteSuccess);
    }

    private async Task<Domain.Entities.Place?> LoadPlaceAsync(DeletePlaceCommand request, CancellationToken ct)
    {
        var query = _repository.All<Domain.Entities.Place>().Where(p => p.Id == request.Model.PlaceId);

        if (request.IsCurrUserAdmin is false)
        {
            query = query.Where(p => p.UserId == request.CurrentUserId);
        }

        return await query.Include(p => p.Reviews).FirstOrDefaultAsync(ct);
    }

    private static bool CanDeletePlace(DeletePlaceCommand request, Domain.Entities.Place place)
    {
        return request.IsCurrUserAdmin || place.UserId == request.CurrentUserId;
    }

    private static bool IsAdminDeletingSomeoneElse(DeletePlaceCommand request, Domain.Entities.Place place)
    {
        return request.IsCurrUserAdmin && place.UserId != request.CurrentUserId;
    }

    private async Task NotifyUserOfAdminDeletionAsync(Domain.Entities.Place place, DeletePlaceCommand request)
    {
        var notification = new Domain.Entities.Notification
        {
            ReceiverId = place.UserId,
            SenderId = request.CurrentUserId,
            Content = $"Your place '{place.Name}' was removed by an admin. Reason: {request.Model.Reason}"
        };

        await _repository.AddAsync(notification);

        await _notificationService.NotifyAsync("An admin deleted your place!", place.UserId);
    }
}
