using Explorify.Application.Abstractions.Interfaces;

namespace Explorify.Application.Notification;

public class NotificationQueueService : INotificationQueueService
{
    private readonly INotificationService _notificationService;

    private readonly List<(Domain.Entities.Notification Notification, string? RealTimeMessage)> _queue = new();

    public NotificationQueueService(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task FlushAsync()
    {
        if (_queue.Count == 0)
        {
            return;
        }

        foreach (var (notification, realTimeMessage) in _queue)
        {
            if (!string.IsNullOrWhiteSpace(realTimeMessage))
            {
                await _notificationService.NotifyAsync(realTimeMessage, notification.ReceiverId);
            }
        }

        _queue.Clear();
    }

    public List<Domain.Entities.Notification> GetPendingNotifications()
        => [.. _queue.Select(q => q.Notification)];

    public void QueueNotification(
        Guid senderId,
        Guid receiverId,
        string notificationContent,
        string realTimeMessage)
    {
        var notification = new Domain.Entities.Notification
        {
            ReceiverId = receiverId,
            SenderId = senderId,
            Content = notificationContent,
        };

        _queue.Add((notification, realTimeMessage));
    }
}
