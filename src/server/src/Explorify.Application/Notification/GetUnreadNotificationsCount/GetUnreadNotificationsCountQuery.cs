using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notification.GetUnreadNotificationsCount;

public record GetUnreadNotificationsCountQuery(Guid UserId)
    : IQuery<int>;
