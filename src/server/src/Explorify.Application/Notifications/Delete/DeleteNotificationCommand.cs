using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notifications.Delete;

public record DeleteNotificationCommand(int NotificationId, Guid UserId)
    : ICommand;
