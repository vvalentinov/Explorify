using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notification.MarkNotificationAsRead;

public record MarkNotificationAsReadCommand(
    int NotificationId,
    Guid UserId) : ICommand;
