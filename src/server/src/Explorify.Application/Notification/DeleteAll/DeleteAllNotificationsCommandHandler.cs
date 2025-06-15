using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Notification.DeleteAll;

public class DeleteAllNotificationsCommandHandler :
    ICommandHandler<DeleteAllNotificationsCommand>
{
    private readonly IRepository _repository;
    private readonly INotificationService _notificationService;

    public DeleteAllNotificationsCommandHandler(
        IRepository repository,
        INotificationService notificationService)
    {
        _repository = repository;
        _notificationService = notificationService;
    }

    public async Task<Result> Handle(
        DeleteAllNotificationsCommand request,
        CancellationToken cancellationToken)
    {
        var currUserId = request.CurrentUserId;

        var notifications = await _repository
            .All<Domain.Entities.Notification>()
            .Where(x => x.ReceiverId == currUserId)
            .ToListAsync(cancellationToken);

        foreach (var notification in notifications)
        {
            _repository.SoftDelete(notification);
            _repository.Update(notification);
        }

        await _repository.SaveChangesAsync();

        await _notificationService.SetZeroNotificationsCount(currUserId);

        return Result.Success("Successfully deleted all notifications!");
    }
}
