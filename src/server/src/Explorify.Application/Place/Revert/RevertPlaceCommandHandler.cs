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
    private readonly IUserService _userService;
    private readonly IEnvironmentService _environmentService;

    public RevertPlaceCommandHandler(
        IRepository repository,
        INotificationService notificationService,
        IUserService userService,
        IEnvironmentService environmentService)
    {
        _repository = repository;

        _notificationService = notificationService;
        _userService = userService;
        _environmentService = environmentService;
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

        if (place.IsApproved)
        {
            await _userService.IncreaseUserPointsAsync(place.UserId, 10);
        }

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
        var env = _environmentService.GetCurrentEnvironment();

        var cutoff = env == "Development"
            ? DateTime.UtcNow.AddMinutes(-1)
            : DateTime.UtcNow.AddDays(-7);

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
