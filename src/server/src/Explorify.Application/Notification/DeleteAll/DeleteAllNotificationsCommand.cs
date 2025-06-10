using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notification.DeleteAll;

public record DeleteAllNotificationsCommand(Guid CurrentUserId)
    : ICommand;
