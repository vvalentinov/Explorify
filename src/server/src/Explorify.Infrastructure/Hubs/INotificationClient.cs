namespace Explorify.Infrastructure.Hubs;

public interface INotificationClient
{
    Task Notify(string message);

    Task IncreaseNotificationsCount();

    Task ReduceNotificationsCount();

    Task SetZeroNotificationsCount();
}
