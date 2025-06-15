namespace Explorify.Application.Abstractions.Interfaces;

public interface INotificationService
{
    Task NotifyAsync(string content, Guid receiverId);

    Task IncreaseNotificationsCountAsync(Guid receiverId);

    Task ReduceNotificationsCountAsync(Guid receiverId);

    Task SetZeroNotificationsCount(Guid receiverId);
}
