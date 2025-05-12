using Microsoft.AspNetCore.SignalR;

namespace Explorify.Infrastructure.Hubs;

public class NotificationHub : Hub<INotificationClient>
{
}
