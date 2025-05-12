using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notifications.GetUserNotifications;

public record GetUserNotificationsQuery(Guid UserId, int Page) :
    IQuery<NotificationListResponseModel>;
