using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Notification.Delete;

public class DeleteNotificationCommandHandler
    : ICommandHandler<DeleteNotificationCommand>
{
    private readonly IRepository _repository;

    private readonly INotificationService _notificationService;

    public DeleteNotificationCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;

        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        DeleteNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await _repository
            .All<Domain.Entities.Notification>()
            .FirstOrDefaultAsync(x =>
                x.Id == request.NotificationId &&
                x.ReceiverId == request.UserId,
                cancellationToken);

        if (notification is null)
        {
            var error = new Error("No notification found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        _repository.SoftDelete(notification);
        await _repository.SaveChangesAsync();

        await _notificationService.ReduceNotificationsCountAsync(request.UserId);

        return Result.Success("Notificaton deleted successfully!");
    }
}
