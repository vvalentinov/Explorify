using Explorify.Application;
using Explorify.Infrastructure.Hubs;

using Microsoft.AspNetCore.SignalR;

namespace Explorify.Infrastructure;

public class NotificationService
    : INotificationService
{
    private readonly IHubContext<NotificationHub, INotificationClient> _notificationHub;

    public NotificationService(
        IHubContext<NotificationHub, INotificationClient> notificationHub)
    {
        _notificationHub = notificationHub;
    }

    public async Task NotifyAsync(
        string content,
        Guid receiverId)
    {
        await _notificationHub
            .Clients
            .User(receiverId.ToString())
            .Notify(content);

        await IncreaseNotificationsCountAsync(receiverId);
    }

    public async Task IncreaseNotificationsCountAsync(Guid receiverId)
    {
        await _notificationHub
            .Clients
            .User(receiverId.ToString())
            .IncreaseNotificationsCount();
    }

    public async Task ReduceNotificationsCountAsync(Guid receiverId)
    {
        await _notificationHub
            .Clients
            .User(receiverId.ToString())
            .ReduceNotificationsCount();
    }
}
