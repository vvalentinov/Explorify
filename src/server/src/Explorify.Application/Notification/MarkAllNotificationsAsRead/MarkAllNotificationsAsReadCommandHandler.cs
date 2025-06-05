using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Notification.MarkAllNotificationsAsRead;

public class MarkAllNotificationsAsReadCommandHandler
    : ICommandHandler<MarkAllNotificationsAsReadCommand>
{
    private readonly IRepository _repository;

    public MarkAllNotificationsAsReadCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        MarkAllNotificationsAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = request.CurrentUserId;

        var unreadNotifications = await _repository
            .All<Domain.Entities.Notification>()
            .Where(x => x.ReceiverId == currentUserId && !x.IsRead)
            .ToListAsync(cancellationToken);

        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
            _repository.Update(notification);
        }

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully marked all notifications as read!");
    }
}
