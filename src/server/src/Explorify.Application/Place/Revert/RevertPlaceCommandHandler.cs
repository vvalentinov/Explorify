using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Place.Revert;

public class RevertPlaceCommandHandler
    : ICommandHandler<RevertPlaceCommand>
{
    private readonly IRepository _repository;

    private readonly INotificationService _notificationService;

    public RevertPlaceCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;

        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        RevertPlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await GetRevertablePlaceAsync(request, cancellationToken);

        if (place is null)
        {
            var error = new Error("No place was found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.RevertDeletion();

        if (IsAdminRevertingOthersPlace(request, place))
        {
            await NotifyUserAboutRevertAsync(request.CurrentUserId, place);
        }

        await _repository.SaveChangesAsync();

        if (IsAdminRevertingOthersPlace(request, place))
        {
            await _notificationService.NotifyAsync(
                "Admin reverted a place of yours! Check your notifications.",
                place.UserId);
        }

        return Result.Success("Successfully reverted deleted place!");
    }

    private async Task<Domain.Entities.Place?> GetRevertablePlaceAsync(
        RevertPlaceCommand request,
        CancellationToken ct)
    {
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        var query = _repository
            .All<Domain.Entities.Place>(ignoreQueryFilters: true)
            .Include(x => x.Reviews)
            .Where(x =>
                x.IsDeleted &&
                !x.IsCleaned &&
                x.DeletedOn >= cutoff);

        if (!request.IsCurrUserAdmin)
        {
            query = query.Where(x => x.UserId == request.CurrentUserId && !x.IsDeletedByAdmin);
        }

        return await query.FirstOrDefaultAsync(x => x.Id == request.PlaceId, ct);
    }

    private static bool IsAdminRevertingOthersPlace(
        RevertPlaceCommand request,
        Domain.Entities.Place place)
    {
        return request.IsCurrUserAdmin && place.UserId != request.CurrentUserId;
    }

    private async Task NotifyUserAboutRevertAsync(
        Guid adminId,
        Domain.Entities.Place place)
    {
        var notification = new Domain.Entities.Notification
        {
            ReceiverId = place.UserId,
            SenderId = adminId,
            Content = $"Your place '{place.Name}' was reverted by admin and is now pending approval!"
        };

        await _repository.AddAsync(notification);
    }
}
