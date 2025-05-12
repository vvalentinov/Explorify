namespace Explorify.Application;

public interface INotificationService
{
    Task NotifyAsync(
        string content,
        Guid receiverId);

    Task IncreaseNotificationsCountAsync(Guid receiverId);

    Task ReduceNotificationsCountAsync(Guid receiverId);
}
