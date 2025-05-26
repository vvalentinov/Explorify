using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notification.Delete;

public record DeleteNotificationCommand(
    int NotificationId,
    Guid UserId) : ICommand;
