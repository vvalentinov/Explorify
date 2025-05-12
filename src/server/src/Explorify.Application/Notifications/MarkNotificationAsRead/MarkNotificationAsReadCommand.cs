using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notifications.MarkNotificationAsRead;

public record MarkNotificationAsReadCommand(int NotificationId, Guid UserId)
    : ICommand;
