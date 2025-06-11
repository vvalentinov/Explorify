namespace Explorify.Application.Notification;

public interface INotificationQueueService
{
    void QueueNotification(
        Guid senderId,
        Guid receiverId,
        string notificationContent,
        string realTimeMessage);

    // Pushes via SignalR
    Task FlushAsync();

    List<Domain.Entities.Notification> GetPendingNotifications();
}
