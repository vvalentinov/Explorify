using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Notifications.MarkNotificationAsRead;

public class MarkNotificationAsReadCommandHandler
    : ICommandHandler<MarkNotificationAsReadCommand>
{
    private readonly IRepository _repository;
    private readonly INotificationService _notificationHubService;

    public MarkNotificationAsReadCommandHandler(
        IRepository repository,
        INotificationService notificationHubService)
    {
        _repository = repository;
        _notificationHubService = notificationHubService;
    }

    public async Task<Result> Handle(
        MarkNotificationAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await _repository
            .All<Notification>()
            .FirstOrDefaultAsync(x =>
                x.Id == request.NotificationId && x.ReceiverId == request.UserId,
                cancellationToken);

        if (notification == null)
        {
            var error = new Error("No notification with id was found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (notification.IsDeleted)
        {
            var error = new Error("Notification was deleted!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (notification.IsRead)
        {
            var error = new Error("Notification was already marked as read!", ErrorType.Validation);
            return Result.Failure(error);
        }

        notification.IsRead = true;

        _repository.Update(notification);

        await _repository.SaveChangesAsync();

        await _notificationHubService.ReduceNotificationsCountAsync(request.UserId);

        return Result.Success("Successfully marked notification as read!");
    }
}
