using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notification.MarkAllNotificationsAsRead;

public record MarkAllNotificationsAsReadCommand(Guid CurrentUserId)
    : ICommand;
